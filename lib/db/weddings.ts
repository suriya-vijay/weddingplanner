import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { STARTER_CHECKLIST, STARTER_TIMELINE } from "@/lib/db/starter-data";

export type Wedding = {
  id: string;
  coupleNames: string;
  partnerA: string;
  partnerB: string;
  date: string | null;
  city: string;
  venue: string;
  tradition: string;
  guestEstimate: number;
  totalBudget: number;
};

type WeddingRow = {
  id: string;
  couple_names: string;
  partner_a: string;
  partner_b: string;
  date: string | null;
  city: string;
  venue: string;
  tradition: string;
  guest_estimate: number;
  total_budget: number;
};

function toWedding(r: WeddingRow): Wedding {
  return {
    id: r.id,
    coupleNames: r.couple_names,
    partnerA: r.partner_a,
    partnerB: r.partner_b,
    date: r.date,
    city: r.city,
    venue: r.venue,
    tradition: r.tradition,
    guestEstimate: r.guest_estimate,
    totalBudget: Number(r.total_budget),
  };
}

/**
 * Resolve the signed-in couple's wedding, creating it on first visit with a
 * starter checklist + timeline. Returns null if not signed in. RLS ensures a
 * couple only ever sees their own row.
 *
 * React.cache: the layout, page and any server action in the same request share
 * one lookup — and it also collapses a first-visit double-create race into one.
 */
export const getOrCreateWedding = cache(async function getOrCreateWedding(): Promise<Wedding | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const displayName =
    (user.user_metadata?.display_name as string | undefined)?.trim() || "";

  // Existing?
  const { data: existing } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (existing) return toWedding(existing as WeddingRow);

  // Create the wedding row (owner_id defaults enforced by RLS with-check).
  const { data: created, error } = await supabase
    .from("weddings")
    .insert({ owner_id: user.id, couple_names: displayName })
    .select("*")
    .single();
  if (error || !created) return null;

  const weddingId = (created as WeddingRow).id;

  // Seed starter checklist + timeline (best-effort; ignore partial failures).
  await Promise.all([
    supabase.from("checklist_items").insert(
      STARTER_CHECKLIST.map((c, i) => ({
        wedding_id: weddingId,
        task: c.task,
        phase: c.phase,
        category: c.category,
        done: false,
        sort: i,
      })),
    ),
    supabase.from("timeline_milestones").insert(
      STARTER_TIMELINE.map((t, i) => ({
        wedding_id: weddingId,
        title: t.title,
        detail: t.detail,
        status: "upcoming",
        sort: i,
      })),
    ),
  ]);

  return toWedding(created as WeddingRow);
});

/** Update editable wedding profile fields (settings page). */
export async function updateWedding(
  weddingId: string,
  patch: Partial<{
    couple_names: string;
    partner_a: string;
    partner_b: string;
    date: string | null;
    city: string;
    venue: string;
    tradition: string;
    guest_estimate: number;
    total_budget: number;
  }>,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("weddings").update(patch).eq("id", weddingId);
}
