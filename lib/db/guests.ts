import { createClient } from "@/lib/supabase/server";
import type { Guest } from "@/lib/mock-data";

type GuestRow = {
  id: string;
  name: string;
  side: string;
  group: string;
  count: number;
  rsvp: string;
  meal: string;
};

const toGuest = (r: GuestRow): Guest => ({
  id: r.id,
  name: r.name,
  side: r.side as Guest["side"],
  group: r.group,
  count: r.count,
  rsvp: r.rsvp as Guest["rsvp"],
  meal: r.meal as Guest["meal"],
});

export async function getGuests(weddingId: string): Promise<Guest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guests")
    .select("id, name, side, \"group\", count, rsvp, meal")
    .eq("wedding_id", weddingId)
    .order("created_at");
  return ((data ?? []) as GuestRow[]).map(toGuest);
}

export async function addGuest(
  weddingId: string,
  g: Omit<Guest, "id">,
): Promise<Guest | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guests")
    .insert({
      wedding_id: weddingId,
      name: g.name,
      side: g.side,
      group: g.group,
      count: g.count,
      rsvp: g.rsvp,
      meal: g.meal,
    })
    .select("id, name, side, \"group\", count, rsvp, meal")
    .single();
  return data ? toGuest(data as GuestRow) : null;
}

export async function updateGuest(
  id: string,
  patch: Partial<Omit<Guest, "id">>,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("guests").update(patch).eq("id", id);
}

export async function deleteGuest(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("guests").delete().eq("id", id);
}
