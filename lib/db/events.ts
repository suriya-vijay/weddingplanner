import { createClient } from "@/lib/supabase/server";

/**
 * Wedding events (Haldi, Sangeet, Reception…) and per-event guest assignment.
 * Scoped to the wedding via RLS (can_access_wedding), so collaborators share
 * them too. Guarded so a pre-0015 DB degrades gracefully (returns empty).
 */

export type WeddingEvent = {
  id: string;
  name: string;
  date: string | null;
  sort: number;
};

type EventRow = { id: string; name: string; date: string | null; sort: number };

const toEvent = (r: EventRow): WeddingEvent => ({
  id: r.id,
  name: r.name,
  date: r.date,
  sort: r.sort,
});

export async function getEvents(weddingId: string): Promise<WeddingEvent[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, name, date, sort")
      .eq("wedding_id", weddingId)
      .order("sort")
      .order("created_at");
    if (error) return [];
    return ((data ?? []) as EventRow[]).map(toEvent);
  } catch {
    return [];
  }
}

export async function addEvent(
  weddingId: string,
  e: { name: string; date: string | null; sort: number },
): Promise<WeddingEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({ wedding_id: weddingId, name: e.name, date: e.date, sort: e.sort })
    .select("id, name, date, sort")
    .single();
  if (error || !data) return null;
  return toEvent(data as EventRow);
}

export async function updateEvent(
  id: string,
  patch: Partial<{ name: string; date: string | null; sort: number }>,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("events").update(patch).eq("id", id);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
}

/** All (event_id, guest_id) assignment pairs for a wedding's events. */
export async function getEventGuestMap(
  eventIds: string[],
): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  if (eventIds.length === 0) return map;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("event_guests")
      .select("event_id, guest_id")
      .in("event_id", eventIds);
    if (error) return map;
    for (const row of (data ?? []) as { event_id: string; guest_id: string }[]) {
      (map[row.event_id] ??= []).push(row.guest_id);
    }
    return map;
  } catch {
    return map;
  }
}

/** Toggle whether a guest attends an event. */
export async function setEventGuest(
  eventId: string,
  guestId: string,
  attending: boolean,
): Promise<void> {
  const supabase = await createClient();
  if (attending) {
    await supabase
      .from("event_guests")
      .upsert({ event_id: eventId, guest_id: guestId });
  } else {
    await supabase
      .from("event_guests")
      .delete()
      .eq("event_id", eventId)
      .eq("guest_id", guestId);
  }
}
