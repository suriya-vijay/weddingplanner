"use server";

import { createClient } from "@/lib/supabase/server";
import type { InspirationItem } from "@/lib/mock-data";
import type { GalleryItem } from "@/lib/db/inspiration";

/**
 * Admin inspiration CRUD. RLS restricts writes to admins; these actions run in
 * the admin's session so the policy applies. Returns the saved row (with its DB
 * id) for creates.
 */

type Draft = Omit<GalleryItem, "id">;

export async function addInspirationAction(
  draft: Draft,
): Promise<GalleryItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inspiration_items")
    .insert({
      title: draft.title,
      ceremony: draft.ceremony,
      tradition: draft.tradition,
      color: draft.color,
      budget: draft.budget,
      location: draft.location,
      aspect: draft.aspect,
      plate: draft.plate,
      image_url: draft.imageUrl,
      vendors: draft.vendors,
    })
    .select("id, title, ceremony, tradition, color, budget, location, aspect, plate, image_url, vendors")
    .single();
  if (!data) return null;
  const r = data as Record<string, unknown>;
  return {
    id: r.id as string,
    title: r.title as string,
    ceremony: r.ceremony as InspirationItem["ceremony"],
    tradition: r.tradition as InspirationItem["tradition"],
    color: r.color as InspirationItem["color"],
    budget: r.budget as InspirationItem["budget"],
    location: r.location as InspirationItem["location"],
    aspect: Number(r.aspect),
    plate: r.plate as string,
    imageUrl: (r.image_url as string | null) ?? null,
    vendors: (r.vendors as string[]) ?? [],
  };
}

export async function updateInspirationAction(
  id: string,
  draft: Draft,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("inspiration_items")
    .update({
      title: draft.title,
      ceremony: draft.ceremony,
      tradition: draft.tradition,
      color: draft.color,
      budget: draft.budget,
      location: draft.location,
      aspect: draft.aspect,
      plate: draft.plate,
      image_url: draft.imageUrl,
      vendors: draft.vendors,
    })
    .eq("id", id);
}

export async function deleteInspirationAction(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("inspiration_items").delete().eq("id", id);
}

/**
 * Admin vendor moderation. RLS `vendors_admin` grants admins full write; these
 * run in the admin's session. Approve = toggle `verified`; delete removes a
 * vendor (e.g. spam / inappropriate). Public marketplace reflects both.
 */
export async function setVendorVerifiedAction(
  id: string,
  verified: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("vendors")
    .update({ verified })
    .eq("id", id);
  return { ok: !error };
}

export async function deleteVendorAction(
  id: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from("vendors").delete().eq("id", id);
  return { ok: !error };
}

/**
 * Approve / reject a vendor for the public marketplace (status gate, 0008).
 * Approving sets the verified badge and clears any prior reason; rejecting
 * hides the vendor and records the admin's reason (0009) so the vendor sees it
 * in their portal and can fix + resubmit. Best-effort on rejection_reason so a
 * pre-0009 DB still moderates. Deletion is the separate hard-remove above.
 */
export async function setVendorStatusAction(
  id: string,
  status: "pending" | "approved" | "rejected",
  reason = "",
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const patch: {
    status: string;
    verified?: boolean;
    rejection_reason?: string;
  } = { status, rejection_reason: status === "rejected" ? reason.trim() : "" };
  if (status === "approved") patch.verified = true;

  const { error } = await supabase.from("vendors").update(patch).eq("id", id);
  if (error) {
    // Pre-0009 DB (no rejection_reason column): retry without it so status
    // moderation still works.
    const { rejection_reason: _omit, ...rest } = patch;
    void _omit;
    const { error: e2 } = await supabase
      .from("vendors")
      .update(rest)
      .eq("id", id);
    return { ok: !e2 };
  }
  return { ok: true };
}
