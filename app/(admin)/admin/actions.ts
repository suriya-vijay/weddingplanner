"use server";

import { createClient } from "@/lib/supabase/server";
import type { InspirationItem } from "@/lib/mock-data";

/**
 * Admin inspiration CRUD. RLS restricts writes to admins; these actions run in
 * the admin's session so the policy applies. Returns the saved row (with its DB
 * id) for creates.
 */

type Draft = Omit<InspirationItem, "id">;

export async function addInspirationAction(
  draft: Draft,
): Promise<InspirationItem | null> {
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
      vendors: draft.vendors,
    })
    .select("id, title, ceremony, tradition, color, budget, location, aspect, plate, vendors")
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
      vendors: draft.vendors,
    })
    .eq("id", id);
}

export async function deleteInspirationAction(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("inspiration_items").delete().eq("id", id);
}
