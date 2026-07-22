import { createClient } from "@/lib/supabase/server";
import { getOrCreateWedding } from "@/lib/db/weddings";

/**
 * Mood-board saves — a couple hearting inspiration items.
 *
 * The `saved_inspiration` table + its owner-scoped RLS have existed since
 * 0002, but nothing ever wrote to them: the gallery heart was local React
 * state, so saves vanished on refresh and the dashboard faked the strip with
 * `gallery.slice(0, 5)`. These are the reads/writes that make it real.
 */

/** The inspiration ids this couple has saved (empty for signed-out users). */
export async function getSavedInspirationIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saved_inspiration")
    .select("inspiration_id");
  return ((data ?? []) as { inspiration_id: string }[]).map(
    (r) => r.inspiration_id,
  );
}

/**
 * Toggle one item on the couple's board. Returns the new saved state, or null
 * if the caller isn't a couple (RLS scopes rows through their wedding).
 */
export async function toggleSavedInspiration(
  inspirationId: string,
): Promise<boolean | null> {
  const supabase = await createClient();
  const wedding = await getOrCreateWedding();
  if (!wedding) return null;

  const { data: existing } = await supabase
    .from("saved_inspiration")
    .select("inspiration_id")
    .eq("wedding_id", wedding.id)
    .eq("inspiration_id", inspirationId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("saved_inspiration")
      .delete()
      .eq("wedding_id", wedding.id)
      .eq("inspiration_id", inspirationId);
    return false;
  }

  const { error } = await supabase
    .from("saved_inspiration")
    .insert({ wedding_id: wedding.id, inspiration_id: inspirationId });
  return error ? null : true;
}
