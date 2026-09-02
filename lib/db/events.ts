import { createClient } from "@/lib/supabase/server";

/**
 * Wedding events (Haldi, Sangeet, Reception…) and per-event guest assignment.
 * Scoped to the wedding via RLS (can_access_wedding), so collaborators share
 * them too. Guarded so a pre-0015 DB degrades gracefully (returns empty).
 */

/**
 * An event holds everything a wedding invitation needs — these fields are the
 * structured source of truth that feeds the digital invite (each guest's invite
 * renders the events they're checked into, pulling this data).
 */
export type WeddingEvent = {
  id: string;
  name: string;
  date: string | null;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  notes: string;
  sort: number;
};

/** The editable invitation fields (everything except id/sort). */
export type EventDetails = {
  name: string;
  date: string | null;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  notes: string;
};

type EventRow = {
  id: string;
  name: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  address: string | null;
  dress_code: string | null;
  notes: string | null;
  sort: number;
};

const COLS = "id, name, date, time, venue, address, dress_code, notes, sort";
// Fallback for a pre-0016 DB (new columns absent).
const COLS_BASIC = "id, name, date, sort";

const toEvent = (r: Partial<EventRow>): WeddingEvent => ({
  id: r.id as string,
  name: r.name ?? "",
  date: r.date ?? null,
  time: r.time ?? "",
  venue: r.venue ?? "",
  address: r.address ?? "",
  dressCode: r.dress_code ?? "",
  notes: r.notes ?? "",
  sort: r.sort ?? 0,
});

const toRow = (d: Partial<EventDetails>) => {
  const row: Record<string, unknown> = {};
  if (d.name !== undefined) row.name = d.name;
  if (d.date !== undefined) row.date = d.date;
  if (d.time !== undefined) row.time = d.time;
  if (d.venue !== undefined) row.venue = d.venue;
  if (d.address !== undefined) row.address = d.address;
  if (d.dressCode !== undefined) row.dress_code = d.dressCode;
  if (d.notes !== undefined) row.notes = d.notes;
  return row;
};

export async function getEvents(weddingId: string): Promise<WeddingEvent[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("events")
      .select(COLS)
      .eq("wedding_id", weddingId)
      .order("sort")
      .order("created_at");
    if (error) {
      // pre-0016 DB — retry with just the basic columns.
      const { data: basic } = await supabase
        .from("events")
        .select(COLS_BASIC)
        .eq("wedding_id", weddingId)
        .order("sort")
        .order("created_at");
      return ((basic ?? []) as Partial<EventRow>[]).map(toEvent);
    }
    return ((data ?? []) as EventRow[]).map(toEvent);
  } catch {
    return [];
  }
}

export async function addEvent(
  weddingId: string,
  e: EventDetails & { sort: number },
): Promise<WeddingEvent | null> {
  const supabase = await createClient();
  const payload = { wedding_id: weddingId, sort: e.sort, ...toRow(e) };
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select(COLS)
    .single();
  if (!error && data) return toEvent(data as EventRow);
  // pre-0016 DB — insert just name/date/sort.
  const { data: basic, error: e2 } = await supabase
    .from("events")
    .insert({ wedding_id: weddingId, name: e.name, date: e.date, sort: e.sort })
    .select(COLS_BASIC)
    .single();
  if (e2 || !basic) return null;
  return toEvent(basic as Partial<EventRow>);
}

export async function updateEvent(
  id: string,
  patch: Partial<EventDetails & { sort: number }>,
): Promise<void> {
  const supabase = await createClient();
  const { sort, ...details } = patch;
  const row = { ...toRow(details), ...(sort !== undefined ? { sort } : {}) };
  const { error } = await supabase.from("events").update(row).eq("id", id);
  if (error) {
    // pre-0016 DB — retry with only the basic columns.
    const basic: Record<string, unknown> = {};
    if (patch.name !== undefined) basic.name = patch.name;
    if (patch.date !== undefined) basic.date = patch.date;
    if (sort !== undefined) basic.sort = sort;
    if (Object.keys(basic).length) {
      await supabase.from("events").update(basic).eq("id", id);
    }
  }
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
