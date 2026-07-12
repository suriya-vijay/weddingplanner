import { createClient } from "@/lib/supabase/server";
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
    startingAt: v.starting_at,
    priceTier: (v.price_tier as VendorProfile["priceTier"]) || "₹₹",
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
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return (data as (VendorRow & { status?: string })[])
    .filter(isApproved)
    .map((v) => toProfile(v, [], []));
}

/** All vendors WITH id + status — for the admin manager (approve/reject/delete). */
export async function getVendorsForAdmin(): Promise<
  (VendorProfile & { id: string; status: string })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return (data as (VendorRow & { status?: string })[]).map((v) => ({
    id: v.id,
    status: v.status ?? "approved",
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
): Promise<(VendorProfile & { id: string }) | null> {
  const supabase = await createClient();
  const { data: v } = await supabase
    .from("vendors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!v) return null;
  if (!isApproved(v as { status?: string })) return null;

  const row = v as VendorRow;
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

  return {
    id: row.id,
    ...toProfile(
      row,
      (pkgs ?? []) as VendorPackage[],
      (revs ?? []) as VendorReview[],
    ),
  };
}

/** Slugs for generateStaticParams — but the marketplace is now dynamic, so
 *  this returns all slugs for optional prerender hints. */
export async function getAllVendorSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("vendors").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
