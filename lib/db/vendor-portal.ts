import { createClient, createServiceClient } from "@/lib/supabase/server";
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
};

export type MyVendor = VendorProfile & { id: string };

function toProfile(v: VendorRow): MyVendor {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    category: v.category,
    tagline: v.tagline,
    location: v.location,
    serviceAreas: v.service_areas ?? [],
    rating: Number(v.rating),
    reviews: v.reviews,
    startingAt: v.starting_at,
    priceTier: (v.price_tier as VendorProfile["priceTier"]) || "₹₹",
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
  profile.packages = (pkgs ?? []) as VendorProfile["packages"];
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
  return (data ?? []) as {
    id: string;
    name: string;
    price: string;
    features: string[];
  }[];
}

/**
 * Claim an unclaimed seeded vendor for a new vendor account (service-role, runs
 * from the signup action). Prefers "The Lighthouse Films" so the demo vendor
 * has rich content; falls back to any unclaimed vendor, else creates a blank one.
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

  // Prefer the demo flagship, else the first unclaimed vendor.
  const { data: flagship } = await admin
    .from("vendors")
    .select("id")
    .eq("slug", "the-lighthouse-films")
    .is("owner_id", null)
    .maybeSingle();

  let targetId = flagship?.id as string | undefined;
  if (!targetId) {
    const { data: anyFree } = await admin
      .from("vendors")
      .select("id")
      .is("owner_id", null)
      .limit(1)
      .maybeSingle();
    targetId = anyFree?.id as string | undefined;
  }

  if (targetId) {
    await admin.from("vendors").update({ owner_id: userId }).eq("id", targetId);
    return;
  }

  // Nothing free — create a blank vendor for them.
  const slug = `vendor-${userId.slice(0, 8)}`;
  await admin.from("vendors").insert({
    owner_id: userId,
    slug,
    name: displayName || "My Business",
    category: "Photography",
  });
}
