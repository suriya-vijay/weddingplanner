"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/get-session";
import { logModeration } from "@/lib/db/admin-moderation";
import { setContactHandled } from "@/lib/db/contact";
import { sendEmail } from "@/lib/email/client";
import { vendorStatusEmail } from "@/lib/email/templates";
import type { InspirationItem } from "@/lib/mock-data";
import type { GalleryItem } from "@/lib/db/inspiration";

/**
 * Admin inspiration CRUD. RLS restricts writes to admins; these actions run in
 * the admin's session so the policy applies. Returns the saved row (with its DB
 * id) for creates.
 *
 * Every action re-checks the admin role itself: server actions are public
 * endpoints, and some steps below (audit log, vendor emails, contact inbox)
 * use the service-role client, which RLS can't protect.
 */

type Draft = Omit<GalleryItem, "id">;

export async function addInspirationAction(
  draft: Draft,
): Promise<GalleryItem | null> {
  if (!(await requireRole("admin"))) return null;
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
): Promise<{ ok: boolean }> {
  if (!(await requireRole("admin"))) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
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
    .eq("id", id)
    .select("id");
  return { ok: !error && !!data?.length };
}

export async function deleteInspirationAction(id: string): Promise<{ ok: boolean }> {
  if (!(await requireRole("admin"))) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inspiration_items")
    .delete()
    .eq("id", id)
    .select("id");
  return { ok: !error && !!data?.length };
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
  if (!(await requireRole("admin"))) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .update({ verified })
    .eq("id", id)
    .select("id");
  return { ok: !error && !!data?.length };
}

export async function deleteVendorAction(
  id: string,
): Promise<{ ok: boolean }> {
  const actor = await requireRole("admin");
  if (!actor) return { ok: false };
  const supabase = await createClient();
  // Log BEFORE deleting: logModeration reads the vendor's name to denormalise
  // it into the entry, which it can't do once the row is gone.
  await logModeration({
    vendorId: id,
    actorName: actor.name,
    action: "deleted",
  });
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
  const actor = await requireRole("admin");
  if (!actor) return { ok: false };
  if (!["pending", "approved", "rejected"].includes(status)) return { ok: false };
  const supabase = await createClient();
  // The Verified badge means "an admin approved this listing" — it must not
  // survive a later rejection or a move back to pending.
  const patch: {
    status: string;
    verified: boolean;
    rejection_reason?: string;
  } = {
    status,
    verified: status === "approved",
    rejection_reason: status === "rejected" ? reason.trim() : "",
  };

  let { data, error } = await supabase
    .from("vendors")
    .update(patch)
    .eq("id", id)
    .select("id");
  if (error) {
    // Pre-0009 DB (no rejection_reason column): retry without it so status
    // moderation still works.
    const { rejection_reason: _omit, ...rest } = patch;
    void _omit;
    ({ data, error } = await supabase
      .from("vendors")
      .update(rest)
      .eq("id", id)
      .select("id"));
  }
  // No error but no row = the vendor no longer exists (or RLS hid it).
  if (error || !data?.length) return { ok: false };

  // Append to the audit trail. `rejection_reason` is overwritten on approve
  // and cleared when the vendor resubmits, so without this the reason — and
  // any record of who acted — is lost.
  await logModeration({
    vendorId: id,
    actorName: actor.name,
    action: status,
    reason,
  });

  // Email the vendor about approve/reject (not pending). Best-effort: resolve
  // their email from owner_id via the auth admin API (profiles hold no email).
  // Any failure here must not fail the moderation action.
  if (status === "approved" || status === "rejected") {
    try {
      const admin = createServiceClient();
      const { data: row } = await admin
        .from("vendors")
        .select("owner_id, name")
        .eq("id", id)
        .single();
      const ownerId = (row as { owner_id?: string | null } | null)?.owner_id;
      if (ownerId) {
        const { data: userRes } = await admin.auth.admin.getUserById(ownerId);
        const to = userRes?.user?.email;
        if (to) {
          const { subject, html } = vendorStatusEmail({
            name: (row as { name?: string }).name ?? "there",
            status,
            reason,
          });
          await sendEmail({ to, subject, html });
        }
      }
    } catch (err) {
      console.error("[email] vendor status notification skipped:", err);
    }
  }
  return { ok: true };
}

/** Edit a vendor's details in place. Moderation shouldn't be all-or-nothing:
 *  the only other tool is a hard delete that cascades away their packages,
 *  reviews and enquiries. */
export async function updateVendorAsAdminAction(
  id: string,
  patch: {
    name?: string;
    category?: string;
    location?: string;
    tagline?: string;
    cover_url?: string | null;
  },
): Promise<{ ok: boolean }> {
  const actor = await requireRole("admin");
  if (!actor) return { ok: false };
  // Only the editable fields — never let the payload carry status/owner etc.
  const clean = Object.fromEntries(
    Object.entries(patch).filter(([k]) =>
      ["name", "category", "location", "tagline", "cover_url"].includes(k),
    ),
  );
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .update(clean)
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { ok: false };
  await logModeration({
    vendorId: id,
    actorName: actor.name,
    action: "edited",
    reason: Object.keys(clean).join(", "),
  });
  return { ok: true };
}

/** Mark a contact-form submission handled (or put it back in the queue). */
export async function setContactHandledAction(
  id: string,
  handled: boolean,
): Promise<{ ok: boolean }> {
  if (!(await requireRole("admin"))) return { ok: false };
  const ok = await setContactHandled(id, handled);
  return { ok };
}
