"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyVendor } from "@/lib/db/vendor-portal";
import {
  sendEnquiryMessage,
  type EnquiryMessage,
} from "@/lib/db/enquiry-chat";
import type { VendorPackage, EnquiryStatus } from "@/lib/mock-data";

/** Resolve the signed-in vendor's own vendor id (RLS-scoped). */
async function myVendorId(): Promise<string | null> {
  const v = await getMyVendor();
  return v?.id ?? null;
}

/** Resolve the signed-in vendor's row (id + status) in one fetch. */
async function myVendor(): Promise<{ id: string; status: string } | null> {
  const v = await getMyVendor();
  return v ? { id: v.id, status: v.status } : null;
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
  price_tier?: string;
  starting_at?: string;
  availability?: string;
}): Promise<{ ok: boolean }> {
  const me = await myVendor();
  if (!me) return { ok: false };
  const supabase = await createClient();

  // A rejected vendor editing their profile resubmits it for review: flip
  // back to 'pending' and clear the reason. Best-effort so a pre-0009/0008 DB
  // still saves the profile edits.
  const resubmit =
    me.status === "rejected"
      ? { status: "pending", rejection_reason: "" }
      : {};

  const { error } = await supabase
    .from("vendors")
    .update({ ...patch, ...resubmit })
    .eq("id", me.id);
  if (error && Object.keys(resubmit).length) {
    await supabase.from("vendors").update(patch).eq("id", me.id);
  }
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

/** Vendor posts a reply in an enquiry thread (RLS scopes to the vendor owner). */
export async function sendVendorMessageAction(
  enquiryId: string,
  body: string,
): Promise<EnquiryMessage | null> {
  const text = body.trim();
  if (!text) return null;
  return sendEnquiryMessage(enquiryId, "vendor", text);
}
