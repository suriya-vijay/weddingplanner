import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Couple collaboration: invite a partner to co-edit the same wedding.
 *
 * Flow: the OWNER creates a pending invite (random token) → the partner opens
 * /invite/partner/[token], signs up with their OWN login → we link the
 * collaborator row to their new user id (status 'accepted'). From then on,
 * getOrCreateWedding() resolves the shared wedding for them (RLS widened via
 * can_access_wedding in migration 0014).
 *
 * Guarded: if migration 0014 hasn't been applied, these no-op gracefully so the
 * dashboard never breaks.
 */

export type Collaborator = {
  id: string;
  email: string;
  status: "pending" | "accepted";
  token: string;
};

function randomToken(): string {
  // URL-safe, unguessable. crypto.randomUUID is available in the Node runtime.
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  ).slice(0, 40);
}

/** Owner: list collaborators + pending invites for their wedding. */
export async function getCollaborators(
  weddingId: string,
): Promise<Collaborator[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("wedding_collaborators")
      .select("id, invited_email, status, token")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: true });
    if (error) return [];
    return (data ?? []).map((r) => ({
      id: r.id as string,
      email: (r.invited_email as string) ?? "",
      status: (r.status as "pending" | "accepted") ?? "pending",
      token: r.token as string,
    }));
  } catch {
    return [];
  }
}

/**
 * Owner creates a pending invite for `email`. Returns the token (used to build
 * the accept URL) or null if it couldn't be created. Idempotent-ish: reuses an
 * existing pending invite for the same email.
 */
export async function createInvite(
  weddingId: string,
  email: string,
): Promise<{ token: string } | null> {
  const supabase = await createClient();
  try {
    // Reuse a pending invite for the same email if present.
    const { data: existing } = await supabase
      .from("wedding_collaborators")
      .select("token, status")
      .eq("wedding_id", weddingId)
      .eq("invited_email", email.toLowerCase())
      .maybeSingle();
    if (existing?.token && existing.status === "pending") {
      return { token: existing.token as string };
    }

    const token = randomToken();
    const { error } = await supabase.from("wedding_collaborators").insert({
      wedding_id: weddingId,
      invited_email: email.toLowerCase(),
      token,
      status: "pending",
    });
    if (error) return null;
    return { token };
  } catch {
    return null;
  }
}

/** Public: resolve a pending invite by token (service client — pre-auth). */
export async function getInviteByToken(token: string): Promise<{
  weddingId: string;
  coupleNames: string;
  status: string;
} | null> {
  const admin = createServiceClient();
  try {
    const { data, error } = await admin
      .from("wedding_collaborators")
      .select("wedding_id, status, weddings(couple_names)")
      .eq("token", token)
      .maybeSingle();
    if (error || !data) return null;
    const w = data.weddings as { couple_names?: string } | null;
    return {
      weddingId: data.wedding_id as string,
      coupleNames: w?.couple_names ?? "your partner",
      status: (data.status as string) ?? "pending",
    };
  } catch {
    return null;
  }
}

/**
 * Link a pending invite to a newly-created user (service client, called right
 * after signup). Sets user_id + status 'accepted'. Safe if already accepted.
 */
export async function acceptInvite(
  token: string,
  userId: string,
): Promise<boolean> {
  const admin = createServiceClient();
  try {
    const { error } = await admin
      .from("wedding_collaborators")
      .update({
        user_id: userId,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("token", token)
      .eq("status", "pending");
    return !error;
  } catch {
    return false;
  }
}
