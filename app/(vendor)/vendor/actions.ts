"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyVendor } from "@/lib/db/vendor-portal";
import type { VendorPackage, EnquiryStatus } from "@/lib/mock-data";

/** Resolve the signed-in vendor's own vendor id (RLS-scoped). */
async function myVendorId(): Promise<string | null> {
  const v = await getMyVendor();
  return v?.id ?? null;
}

// ── Profile ─────────────────────────────────────────────────────
export async function updateVendorProfileAction(patch: {
  name?: string;
  tagline?: string;
  category?: string;
  location?: string;
  about?: string;
  instagram?: string;
  website?: string;
  cover_url?: string;
  logo_url?: string;
  styles?: string[];
  service_areas?: string[];
}): Promise<{ ok: boolean }> {
  const id = await myVendorId();
  if (!id) return { ok: false };
  const supabase = await createClient();
  await supabase.from("vendors").update(patch).eq("id", id);
  revalidatePath("/vendor", "layout");
  return { ok: true };
}

// ── Packages ────────────────────────────────────────────────────
export async function addPackageAction(
  pkg: VendorPackage,
): Promise<(VendorPackage & { id: string }) | null> {
  const id = await myVendorId();
  if (!id) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendor_packages")
    .insert({ vendor_id: id, name: pkg.name, price: pkg.price, features: pkg.features })
    .select("id, name, price, features")
    .single();
  return data as (VendorPackage & { id: string }) | null;
}

export async function updatePackageAction(
  id: string,
  pkg: VendorPackage,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("vendor_packages")
    .update({ name: pkg.name, price: pkg.price, features: pkg.features })
    .eq("id", id);
}

export async function deletePackageAction(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("vendor_packages").delete().eq("id", id);
}

// ── Enquiries ───────────────────────────────────────────────────
export async function setEnquiryStatusAction(
  id: string,
  status: EnquiryStatus,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("vendor_enquiries").update({ status }).eq("id", id);
}
