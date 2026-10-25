import { createClient, createServiceClient } from "@/lib/supabase/server";
import { roleOf } from "@/lib/auth/role";
import { toUSDisplay } from "@/lib/utils";
import type {
  VendorProfile,
  VendorPackage,
  VendorReview,
} from "@/lib/mock-data";

/**
 * Vendor catalog reads. Rows are mapped back to the existing `VendorProfile`
 * shape so page/components consuming them barely change. Public read (RLS).
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
  profile_views?: number;
};

function toProfile(
  v: VendorRow,
  packages: VendorPackage[],
  reviewList: VendorReview[],
): VendorProfile {
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    tagline: v.tagline,
    location: v.location,
    serviceAreas: v.service_areas ?? [],
    rating: Number(v.rating),
    reviews: v.reviews,
    // Normalize legacy ₹ rows at the boundary so no stray rupee reaches a user.
    startingAt: toUSDisplay(v.starting_at),
    priceTier:
      (toUSDisplay(v.price_tier) as VendorProfile["priceTier"]) || "$$",
    verified: v.verified,
    styles: v.styles ?? [],
    about: v.about,
    packages,
    // Prefer a real uploaded image (Stage 3); fall back to the gradient plate.
    gallery: (v.gallery_urls?.length ? v.gallery_urls : v.gallery_plates) ?? [],
    cover: v.cover_url || v.cover_plate,
    logoPlate: v.logo_url || v.logo_plate,
    instagram: v.instagram,
    website: v.website,
    availability: v.availability,
    reviewList,
  };
}

/**
 * All vendors (unfiltered) for the marketplace grid. NOTE: this is also used by
 * the admin dashboard stat count + inspiration detail page, so it stays
 * unfiltered — PUBLIC surfaces use getPublicVendors() below.
 */
export async function getVendors(): Promise<VendorProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return (data as VendorRow[]).map((v) => toProfile(v, [], []));
}

/** A vendor row's status ('approved' when the column doesn't exist yet). */
function isApproved(v: { status?: string }): boolean {
  return (v.status ?? "approved") === "approved";
}

/**
 * PUBLIC marketplace read — only APPROVED vendors. Falls back to unfiltered if
 * the `status` column isn't there yet (pre-0008), so the page never breaks.
 */
export async function getPublicVendors(): Promise<VendorProfile[]> {
  const supabase = await createClient();
  const [{ data, error }, { data: revs }] = await Promise.all([
    supabase.from("vendors").select("*").order("name"),
    supabase.from("vendor_reviews").select("vendor_id, rating"),
  ]);
  if (error || !data) return [];

  // Rating + count from the ACTUAL reviews, same as the detail page — the
  // hand-entered vendors.rating/reviews columns hold invented seed figures,
  // so the grid said "4.9 · 218 reviews" while the profile said "New".
  const stats = new Map<string, { sum: number; n: number }>();
  for (const r of (revs ?? []) as { vendor_id: string; rating: number }[]) {
    const s = stats.get(r.vendor_id) ?? { sum: 0, n: 0 };
    s.sum += Number(r.rating);
    s.n += 1;
    stats.set(r.vendor_id, s);
  }

  return (data as (VendorRow & { id: string; status?: string })[])
    .filter(isApproved)
    .map((v) => {
      const p = toProfile(v, [], []);
      const s = stats.get(v.id);
      p.reviews = s?.n ?? 0;
      p.rating = s ? Math.round((s.sum / s.n) * 10) / 10 : 0;
      return p;
    });
}

/** A few approved vendors for the homepage teaser: reviewed + verified first. */
export async function getFeaturedVendors(limit = 4): Promise<VendorProfile[]> {
  const all = await getPublicVendors();
  return all
    .sort(
      (a, b) =>
        b.reviews - a.reviews ||
        b.rating - a.rating ||
        Number(b.verified) - Number(a.verified),
    )
    .slice(0, limit);
}

/** All vendors WITH id + status + reason — for the admin manager (approve/reject/delete). */
export async function getVendorsForAdmin(): Promise<
  (VendorProfile & { id: string; status: string; rejectionReason: string })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return (
    data as (VendorRow & { status?: string; rejection_reason?: string })[]
  ).map((v) => ({
    id: v.id,
    status: v.status ?? "approved",
    rejectionReason: v.rejection_reason ?? "",
    ...toProfile(v, [], []),
  }));
}

/**
 * One full vendor profile by slug (PUBLIC detail page), with packages +
 * reviews + DB id. Returns null for non-approved vendors → 404. (The vendor's
 * own portal uses getMyVendor(), which is unaffected.)
 */
export async function getVendorBySlug(
  slug: string,
  opts: { countView?: boolean } = {},
): Promise<(VendorProfile & { id: string; status: string }) | null> {
  const supabase = await createClient();
  const { data: v } = await supabase
    .from("vendors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!v) return null;

  // Non-approved listings are hidden from the public — EXCEPT from their own
  // owner (and admins). The portal shows a "View public profile" button, and
  // it used to 404 during the exact window a vendor is polishing their listing
  // for review. They can preview; nobody else can.
  if (!isApproved(v as { status?: string })) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ownerId = (v as { owner_id?: string | null }).owner_id;
    const mayPreview =
      !!user && (user.id === ownerId || roleOf(user) === "admin");
    if (!mayPreview) return null;
  }

  const row = v as VendorRow;

  // Count a real profile view (only from the page render, never metadata).
  // Anon visitors can't UPDATE vendors under RLS → use the service client.
  // Atomic increment via RPC (0017) so concurrent views don't overwrite each
  // other; falls back to read-then-write on an older DB. Best-effort.
  if (opts.countView) {
    try {
      const admin = createServiceClient();
      const { error } = await admin.rpc("increment_vendor_views", { vid: row.id });
      if (error) {
        await admin
          .from("vendors")
          .update({ profile_views: (row.profile_views ?? 0) + 1 })
          .eq("id", row.id);
      }
    } catch {
      // ignore — view counting must never break the public page
    }
  }
  const [{ data: pkgs }, { data: revs }] = await Promise.all([
    supabase
      .from("vendor_packages")
      .select("name, price, features, sort")
      .eq("vendor_id", row.id)
      .order("sort"),
    supabase
      .from("vendor_reviews")
      .select("author, rating, text, wedding")
      .eq("vendor_id", row.id),
  ]);

  const reviewList = (revs ?? []) as VendorReview[];
  const profile = toProfile(
    row,
    ((pkgs ?? []) as VendorPackage[]).map((p) => ({
      ...p,
      price: toUSDisplay(p.price),
    })),
    reviewList,
  );
  // Rating/count come from the real reviews, not the hand-entered columns.
  profile.reviews = reviewList.length;
  profile.rating = reviewList.length
    ? Math.round(
        (reviewList.reduce((s, r) => s + Number(r.rating), 0) /
          reviewList.length) * 10,
      ) / 10
    : 0;
  return {
    id: row.id,
    status: (row as VendorRow & { status?: string }).status ?? "approved",
    ...profile,
  };
}

/** Slugs for generateStaticParams — but the marketplace is now dynamic, so
 *  this returns all slugs for optional prerender hints. */
export async function getAllVendorSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("vendors").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
