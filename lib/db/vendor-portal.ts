import { createClient, createServiceClient } from "@/lib/supabase/server";
import { toUSDisplay } from "@/lib/utils";
import type { VendorProfile, VendorEnquiry } from "@/lib/mock-data";

/**
 * Vendor-portal data: the vendor row OWNED by the signed-in user, plus their
 * packages, reviews and enquiries. Distinct from the public catalog reads in
 * lib/db/vendors.ts (which are read-only for everyone).
 */

type VendorRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  location: string;
  service_areas: string[];
  rating: number;
  reviews: number;
  starting_at: string;
  price_tier: string;
  verified: boolean;
  styles: string[];
  about: string;
  instagram: string;
  website: string;
  availability: string;
  cover_plate: string;
  logo_plate: string;
  gallery_plates: string[];
  cover_url: string | null;
  logo_url: string | null;
  gallery_urls: string[] | null;
  status?: string;
  rejection_reason?: string;
  profile_views?: number;
};

export type MyVendor = VendorProfile & {
  id: string;
  status: string;
  rejectionReason: string;
  profileViews: number;
};

function toProfile(v: VendorRow): MyVendor {
  return {
    id: v.id,
    status: v.status ?? "approved",
    rejectionReason: v.rejection_reason ?? "",
    profileViews: v.profile_views ?? 0,
    slug: v.slug,
    name: v.name,
    category: v.category,
    tagline: v.tagline,
    location: v.location,
    serviceAreas: v.service_areas ?? [],
    rating: Number(v.rating),
    reviews: v.reviews,
    // Normalize legacy ₹ rows at the boundary (see toUSDisplay).
    startingAt: toUSDisplay(v.starting_at),
    priceTier:
      (toUSDisplay(v.price_tier) as VendorProfile["priceTier"]) || "$$",
    verified: v.verified,
    styles: v.styles ?? [],
    about: v.about,
    packages: [],
    gallery: (v.gallery_urls?.length ? v.gallery_urls : v.gallery_plates) ?? [],
    cover: v.cover_url || v.cover_plate,
    logoPlate: v.logo_url || v.logo_plate,
    instagram: v.instagram,
    website: v.website,
    availability: v.availability,
    reviewList: [],
  };
}

/**
 * The vendor row owned by the signed-in user (with packages + reviews).
 *
 * Get-or-claim: if a vendor-role user has no vendor row yet (e.g. an account
 * created before the signup claim ran), claim one on first visit and re-query
 * — mirroring how getOrCreateWedding() provisions a couple. This keeps the
 * whole portal from 404ing when a vendor was never provisioned.
 */
export async function getMyVendor(): Promise<MyVendor | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const fetchOwned = () =>
    supabase.from("vendors").select("*").eq("owner_id", user.id).maybeSingle();

  let { data: v } = await fetchOwned();

  // No row yet: a vendor-role user claims a seeded vendor on first visit.
  if (!v && user.user_metadata?.role === "vendor") {
    const displayName =
      (user.user_metadata?.display_name as string | undefined)?.trim() || "";
    await claimVendorForUser(user.id, displayName);
    ({ data: v } = await fetchOwned());
  }

  if (!v) return null;

  const row = v as VendorRow;
  const [{ data: pkgs }, { data: revs }] = await Promise.all([
    supabase
      .from("vendor_packages")
      .select("name, price, features")
      .eq("vendor_id", row.id)
      .order("sort"),
    supabase
      .from("vendor_reviews")
      .select("author, rating, text, wedding")
      .eq("vendor_id", row.id),
  ]);

  const profile = toProfile(row);
  profile.packages = ((pkgs ?? []) as VendorProfile["packages"]).map((p) => ({
    ...p,
    price: toUSDisplay(p.price),
  }));
  profile.reviewList = (revs ?? []) as VendorProfile["reviewList"];
  return profile;
}

/** Enquiries for the signed-in vendor's business. */
export async function getMyEnquiries(vendorId: string): Promise<VendorEnquiry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendor_enquiries")
    .select("id, couple, date, event_date, city, functions, budget, status, message")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: {
    id: string;
    couple: string;
    date: string;
    event_date: string;
    city: string;
    functions: string;
    budget: string;
    status: string;
    message: string;
  }) => ({
    id: r.id,
    couple: r.couple,
    date: r.date,
    eventDate: r.event_date,
    city: r.city,
    functions: r.functions,
    budget: r.budget,
    status: r.status as VendorEnquiry["status"],
    message: r.message,
  }));
}

/**
 * Count of the vendor's enquiries that are UNREAD by the vendor — for the
 * sidebar notification badge. Unread = a couple message newer than the vendor's
 * last_seen, OR a brand-new enquiry (no vendor view yet) created after it.
 * Resilient: if the 0011 columns are absent, returns 0 (no badge, no crash).
 */
export async function getVendorUnreadCount(vendorId: string): Promise<number> {
  const supabase = await createClient();
  const { data: enquiries, error } = await supabase
    .from("vendor_enquiries")
    .select("id, created_at, vendor_last_seen_at")
    .eq("vendor_id", vendorId);
  if (error || !enquiries?.length) return 0;

  const ids = enquiries.map((e: { id: string }) => e.id);
  const { data: msgs } = await supabase
    .from("enquiry_messages")
    .select("enquiry_id, sender, created_at")
    .in("enquiry_id", ids)
    .eq("sender", "couple");

  return countUnread(
    enquiries as SeenRow[],
    (msgs ?? []) as MsgRow[],
    "vendor_last_seen_at",
    true, // a brand-new enquiry counts as unread for the vendor
  );
}

/** Stamp all of this vendor's enquiries as seen (clears the badge). Best-effort. */
export async function markVendorEnquiriesSeen(vendorId: string): Promise<void> {
  const supabase = await createClient();
  try {
    await supabase
      .from("vendor_enquiries")
      .update({ vendor_last_seen_at: new Date().toISOString() })
      .eq("vendor_id", vendorId);
  } catch {
    // pre-0011 DB: column absent — no-op.
  }
}

type SeenRow = {
  id: string;
  created_at: string;
  vendor_last_seen_at?: string | null;
  couple_last_seen_at?: string | null;
};
type MsgRow = { enquiry_id: string; created_at: string };

/**
 * Shared unread tally: count enquiries where a message from the other party
 * (or, if `newEnquiryCounts`, the enquiry itself) is newer than my last_seen.
 */
export function countUnread(
  enquiries: SeenRow[],
  otherMessages: MsgRow[],
  seenKey: "vendor_last_seen_at" | "couple_last_seen_at",
  newEnquiryCounts: boolean,
): number {
  const latestMsg = new Map<string, number>();
  for (const m of otherMessages) {
    const t = new Date(m.created_at).getTime();
    const prev = latestMsg.get(m.enquiry_id) ?? 0;
    if (t > prev) latestMsg.set(m.enquiry_id, t);
  }
  let count = 0;
  for (const e of enquiries) {
    const seen = e[seenKey] ? new Date(e[seenKey] as string).getTime() : 0;
    const msgAt = latestMsg.get(e.id) ?? 0;
    const enquiryAt = newEnquiryCounts ? new Date(e.created_at).getTime() : 0;
    if (Math.max(msgAt, enquiryAt) > seen) count += 1;
  }
  return count;
}

/** Packages for the signed-in vendor's business (used by the packages page). */
export async function getMyPackages(
  vendorId: string,
): Promise<{ id: string; name: string; price: string; features: string[] }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendor_packages")
    .select("id, name, price, features")
    .eq("vendor_id", vendorId)
    .order("sort");
  return ((data ?? []) as {
    id: string;
    name: string;
    price: string;
    features: string[];
  }[]).map((p) => ({ ...p, price: toUSDisplay(p.price) }));
}

/** Build a URL-safe slug from a business name, kept unique with a uid suffix. */
function slugForVendor(displayName: string, userId: string): string {
  const base = (displayName || "vendor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "vendor"}-${userId.slice(0, 6)}`;
}

/**
 * Provision a vendor record for a new vendor account (service-role, runs from
 * the signup action and self-heals on first portal visit). Claims an unclaimed
 * seeded row for its plates/placeholders BUT overwrites the identity with the
 * vendor's OWN business name — so a new vendor sees THEIR name, not a seeded
 * vendor's. If nothing is free, creates a fresh blank vendor.
 *
 * (A full blank-slate onboarding + admin approval flow is a separate milestone;
 * this ensures the name is correct today.)
 */
export async function claimVendorForUser(
  userId: string,
  displayName: string,
): Promise<void> {
  const admin = createServiceClient();

  // Already owns one? Done.
  const { data: owned } = await admin
    .from("vendors")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();
  if (owned) return;

  const name = displayName || "My Business";
  const slug = slugForVendor(displayName, userId);

  // Take any unclaimed seeded row (for its plate placeholders), then rebrand it.
  const { data: anyFree } = await admin
    .from("vendors")
    .select("id")
    .is("owner_id", null)
    .limit(1)
    .maybeSingle();
  const targetId = anyFree?.id as string | undefined;

  if (targetId) {
    // Rebrand to the new vendor: their name/slug + a TRULY blank profile. We
    // must wipe EVERY seeded field (category/location/styles/images/etc.), not
    // just the name — otherwise the vendor inherits the seeded row's Decor/
    // Jaipur/styles/gallery. status:'pending' → hidden from the public
    // marketplace until an admin approves (0008). Best-effort on the status
    // field so a pre-0008 DB still claims successfully.
    const base = {
      owner_id: userId,
      name,
      slug,
      tagline: "",
      about: "",
      category: "",
      location: "",
      instagram: "",
      website: "",
      availability: "",
      starting_at: "",
      price_tier: "$$",
      rating: 0,
      reviews: 0,
      verified: false,
      styles: [] as string[],
      service_areas: [] as string[],
      gallery_plates: [] as string[],
      gallery_urls: [] as string[],
      cover_plate: "",
      logo_plate: "",
      cover_url: null as string | null,
      logo_url: null as string | null,
    };
    const { error } = await admin
      .from("vendors")
      .update({ ...base, status: "pending" })
      .eq("id", targetId);
    if (error) await admin.from("vendors").update(base).eq("id", targetId);
    return;
  }

  // Nothing free — create a fresh blank vendor for them.
  const insert = { owner_id: userId, slug, name, category: "" };
  const { error } = await admin
    .from("vendors")
    .insert({ ...insert, status: "pending" });
  if (error) await admin.from("vendors").insert(insert);
}
