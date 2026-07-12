import { createClient } from "@/lib/supabase/server";

/**
 * Venue layout persistence — one JSON blob per wedding. The blob is
 * self-describing so the DB schema never changes as shape types grow.
 */

export type VenueShapeType =
  | "table"
  | "stage"
  | "food"
  | "restroom"
  | "entrance"
  | "label";

export type VenueShape = {
  id: string;
  type: VenueShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  seats?: number; // table capacity
};

export type VenueData = {
  shapes: VenueShape[];
  /** tableShapeId -> guestId[] */
  seats: Record<string, string[]>;
};

export const EMPTY_VENUE: VenueData = { shapes: [], seats: {} };

function normalize(data: unknown): VenueData {
  if (!data || typeof data !== "object") return EMPTY_VENUE;
  const d = data as Partial<VenueData>;
  return {
    shapes: Array.isArray(d.shapes) ? d.shapes : [],
    seats: d.seats && typeof d.seats === "object" ? d.seats : {},
  };
}

/** Resolve the wedding's layout, creating an empty one on first visit. */
export async function getVenueLayout(weddingId: string): Promise<VenueData> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("venue_layouts")
    .select("data")
    .eq("wedding_id", weddingId)
    .maybeSingle();
  if (existing) return normalize((existing as { data: unknown }).data);

  const { data: created } = await supabase
    .from("venue_layouts")
    .insert({ wedding_id: weddingId, data: EMPTY_VENUE })
    .select("data")
    .single();
  return created ? normalize((created as { data: unknown }).data) : EMPTY_VENUE;
}

export async function saveVenueLayout(
  weddingId: string,
  data: VenueData,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("venue_layouts")
    .update({ data, updated_at: new Date().toISOString() })
    .eq("wedding_id", weddingId);
  return { ok: !error };
}
