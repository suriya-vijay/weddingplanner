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

/** All vendors for the marketplace grid (no packages/reviews needed there). */
export async function getVendors(): Promise<VendorProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return (data as VendorRow[]).map((v) => toProfile(v, [], []));
}

/** One full vendor profile by slug, with its packages + reviews. */
export async function getVendorBySlug(
  slug: string,
): Promise<VendorProfile | null> {
  const supabase = await createClient();
  const { data: v } = await supabase
    .from("vendors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!v) return null;

  const [{ data: pkgs }, { data: revs }] = await Promise.all([
    supabase
      .from("vendor_packages")
      .select("name, price, features, sort")
      .eq("vendor_id", (v as VendorRow).id)
      .order("sort"),
    supabase
      .from("vendor_reviews")
      .select("author, rating, text, wedding")
      .eq("vendor_id", (v as VendorRow).id),
  ]);

  return toProfile(
    v as VendorRow,
    (pkgs ?? []) as VendorPackage[],
    (revs ?? []) as VendorReview[],
  );
}

/** Slugs for generateStaticParams — but the marketplace is now dynamic, so
 *  this returns all slugs for optional prerender hints. */
export async function getAllVendorSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("vendors").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
