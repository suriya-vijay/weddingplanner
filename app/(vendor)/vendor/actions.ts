"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyVendor, markVendorEnquiriesSeen } from "@/lib/db/vendor-portal";
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

/** The only columns a vendor may edit on their own listing. Server actions are
 *  public endpoints, so the patch is filtered at runtime — otherwise a vendor
 *  could send `{ status: "approved", verified: true }` and skip review. */
const EDITABLE_PROFILE_FIELDS = [
  "name",
  "tagline",
  "category",
  "location",
  "about",
  "instagram",
  "website",
  "cover_url",
  "logo_url",
  "styles",
  "service_areas",
  "price_tier",
  "starting_at",
  "availability",
] as const;

export async function updateVendorProfileAction(
  patch: Partial<Record<(typeof EDITABLE_PROFILE_FIELDS)[number], string | string[]>>,
): Promise<{ ok: boolean }> {
  const me = await myVendor();
  if (!me) return { ok: false };
  const supabase = await createClient();

  const clean = Object.fromEntries(
    Object.entries(patch ?? {}).filter(([k]) =>
      (EDITABLE_PROFILE_FIELDS as readonly string[]).includes(k),
    ),
  );

  // A rejected vendor editing their profile resubmits it for review: flip
  // back to 'pending' and clear the reason. Best-effort so a pre-0009/0008 DB
  // still saves the profile edits.
  const resubmit =
    me.status === "rejected"
      ? { status: "pending", rejection_reason: "" }
      : {};

  let { error } = await supabase
    .from("vendors")
    .update({ ...clean, ...resubmit })
    .eq("id", me.id);
  if (error && Object.keys(resubmit).length) {
    ({ error } = await supabase.from("vendors").update(clean).eq("id", me.id));
  }
  revalidatePath("/vendor", "layout");
  return { ok: !error };
}

// ── Packages ────────────────────────────────────────────────────
export async function addPackageAction(
  pkg: VendorPackage,
): Promise<(VendorPackage & { id: string }) | null> {
  const id = await myVendorId();
  if (!id) return null;
  const supabase = await createClient();
  // Append after the existing packages so the order the vendor sees is stable.
  const { count } = await supabase
    .from("vendor_packages")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", id);
  const { data } = await supabase
    .from("vendor_packages")
    .insert({
      vendor_id: id,
      name: pkg.name,
      price: pkg.price,
      features: pkg.features,
      sort: count ?? 0,
    })
    .select("id, name, price, features")
    .single();
  revalidatePath("/vendor", "layout");
  return data as (VendorPackage & { id: string }) | null;
}

export async function updatePackageAction(
  id: string,
  pkg: VendorPackage,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendor_packages")
    .update({ name: pkg.name, price: pkg.price, features: pkg.features })
    .eq("id", id)
    .select("id");
  revalidatePath("/vendor", "layout");
  return { ok: !error && !!data?.length };
}

export async function deletePackageAction(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendor_packages")
    .delete()
    .eq("id", id)
    .select("id");
  revalidatePath("/vendor", "layout");
  return { ok: !error && !!data?.length };
}

// ── Enquiries ───────────────────────────────────────────────────
const ENQUIRY_STATUSES: readonly string[] = ["New", "Replied", "Booked", "Closed"];

export async function setEnquiryStatusAction(
  id: string,
  status: EnquiryStatus,
): Promise<{ ok: boolean }> {
  if (!ENQUIRY_STATUSES.includes(status)) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendor_enquiries")
    .update({ status })
    .eq("id", id)
    .select("id");
  revalidatePath("/vendor", "layout");
  return { ok: !error && !!data?.length };
}

/** Mark all the vendor's enquiries as seen (clears the sidebar badge). */
export async function markVendorEnquiriesSeenAction(): Promise<void> {
  const id = await myVendorId();
  if (!id) return;
  await markVendorEnquiriesSeen(id);
  revalidatePath("/vendor", "layout");
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
