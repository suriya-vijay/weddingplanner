import { createServiceClient } from "@/lib/supabase/server";

/**
 * Append-only moderation history (0013).
 *
 * `vendors.rejection_reason` is a single column that gets blanked on approval
 * and wiped when the vendor edits their profile to resubmit — so there was no
 * way to answer "who approved this, and why was it rejected before?". Every
 * write here is best-effort: a pre-0013 DB simply logs nothing rather than
 * failing the moderation action itself.
 */
export type ModerationEntry = {
  id: string;
  vendorId: string;
  vendorName: string;
  actorName: string;
  action: string;
  reason: string;
  createdAt: string;
};

export async function logModeration(input: {
  vendorId: string;
  actorName: string;
  action: string;
  reason?: string;
}): Promise<void> {
  try {
    const admin = createServiceClient();
    // Denormalise the vendor's name so the entry still reads sensibly after
    // the vendor is deleted.
    const { data } = await admin
      .from("vendors")
      .select("name")
      .eq("id", input.vendorId)
      .maybeSingle();
    await admin.from("vendor_moderation_log").insert({
      vendor_id: input.vendorId,
      vendor_name: (data as { name?: string } | null)?.name ?? "",
      actor_name: input.actorName,
      action: input.action,
      reason: input.reason ?? "",
    });
  } catch {
    // Pre-migration: never block the moderation action itself.
  }
}

/** History for every vendor, keyed by vendor id. Empty if 0013 isn't applied. */
export async function getModerationLog(): Promise<
  Record<string, ModerationEntry[]>
> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("vendor_moderation_log")
    .select("id, vendor_id, vendor_name, actor_name, action, reason, created_at")
    .order("created_at", { ascending: false });
  if (error || !data) return {};

  const out: Record<string, ModerationEntry[]> = {};
  for (const r of data as {
    id: string;
    vendor_id: string;
    vendor_name: string;
    actor_name: string;
    action: string;
    reason: string;
    created_at: string;
  }[]) {
    const entry: ModerationEntry = {
      id: r.id,
      vendorId: r.vendor_id,
      vendorName: r.vendor_name,
      actorName: r.actor_name,
      action: r.action,
      reason: r.reason,
      createdAt: r.created_at,
    };
    (out[r.vendor_id] ??= []).push(entry);
  }
  return out;
}
