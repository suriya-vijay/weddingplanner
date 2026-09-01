"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  CalendarHeart,
  ChevronDown,
  Users,
} from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Guest } from "@/lib/mock-data";
import type { WeddingEvent } from "@/lib/db/events";
import {
  addEventAction,
  deleteEventAction,
  setEventGuestAction,
} from "@/app/(dashboard)/dashboard/actions";

// A few common Indian-wedding functions to offer as quick-adds.
const SUGGESTIONS = ["Haldi", "Mehendi", "Sangeet", "Ceremony", "Reception"];

export function EventsView({
  initialGuests,
  initialEvents,
  initialAssignments,
}: {
  initialGuests: Guest[];
  initialEvents: WeddingEvent[];
  initialAssignments: Record<string, string[]>;
}) {
  const guests = initialGuests;
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents);
  // event_id -> Set(guest_id)
  const [attend, setAttend] = useState<Record<string, Set<string>>>(() => {
    const m: Record<string, Set<string>> = {};
    for (const [eid, ids] of Object.entries(initialAssignments)) {
      m[eid] = new Set(ids);
    }
    return m;
  });
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [busy, setBusy] = useState(false);

  const guestById = useMemo(
    () => new Map(guests.map((g) => [g.id, g])),
    [guests],
  );

  function headcount(eventId: string): number {
    const set = attend[eventId];
    if (!set) return 0;
    let n = 0;
    for (const gid of set) n += guestById.get(gid)?.count ?? 1;
    return n;
  }

  async function addEvent(name: string, date: string | null) {
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    const sort = events.length;
    const created = await addEventAction(trimmed, date, sort);
    setBusy(false);
    if (!created) return;
    setEvents((e) => [...e, created]);
    setAttend((a) => ({ ...a, [created.id]: new Set() }));
    setAdding(false);
    setNewName("");
    setNewDate("");
    setOpen(created.id);
  }

  async function removeEvent(id: string) {
    const prev = events;
    setEvents((e) => e.filter((x) => x.id !== id));
    if (open === id) setOpen(null);
    try {
      await deleteEventAction(id);
    } catch {
      setEvents(prev); // rollback
    }
  }

  function toggleGuest(eventId: string, guestId: string) {
    const set = new Set(attend[eventId] ?? []);
    const nowAttending = !set.has(guestId);
    if (nowAttending) set.add(guestId);
    else set.delete(guestId);
    setAttend((a) => ({ ...a, [eventId]: set }));
    // fire-and-forget; on failure, revert this one toggle
    setEventGuestAction(eventId, guestId, nowAttending).catch(() => {
      setAttend((a) => {
        const s = new Set(a[eventId] ?? []);
        if (nowAttending) s.delete(guestId);
        else s.add(guestId);
        return { ...a, [eventId]: s };
      });
    });
  }

  const noGuests = guests.length === 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-h1 text-ink">Events</h1>
        <p className="mt-1 text-ink-soft">
          Create each function and choose who&rsquo;s invited — with a live
          headcount per event.
        </p>
      </header>

      {/* Add-event controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.filter(
            (s) => !events.some((e) => e.name.toLowerCase() === s.toLowerCase()),
          ).map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => addEvent(s, null)}
              className="rounded-full border border-border-strong bg-ivory px-3.5 py-1.5 text-sm text-ink-soft transition-colors duration-[var(--dur-fast)] hover:border-gold-400 hover:text-forest-700 disabled:opacity-50"
            >
              + {s}
            </button>
          ))}
        </div>
        <Button
          variant="primary"
          size="md"
          className="shrink-0"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" /> Add event
        </Button>
      </div>

      {events.length === 0 ? (
        <Panel>
          <EmptyState
            bare
            icon={<CalendarHeart className="h-6 w-6" />}
            title="No events yet"
            action={
              <Button variant="primary" size="md" onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add your first event
              </Button>
            }
          >
            Add each function — Haldi, Mehendi, Sangeet, the ceremony, the
            reception — then check off who&rsquo;s invited to each.
          </EmptyState>
        </Panel>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const isOpen = open === ev.id;
            const count = headcount(ev.id);
            const attending = attend[ev.id] ?? new Set<string>();
            return (
              <Panel key={ev.id} className="overflow-hidden p-0">
                {/* Event header row */}
                <div className="flex items-center gap-3 p-5">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : ev.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                      <CalendarHeart className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-lg text-ink">
                        {ev.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                        <Users className="h-3.5 w-3.5" />
                        {count} {count === 1 ? "guest" : "guests"} invited
                        {ev.date ? ` · ${ev.date}` : ""}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "ml-auto h-5 w-5 shrink-0 text-ink-faint transition-transform duration-[var(--dur-fast)]",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEvent(ev.id)}
                    aria-label={`Delete ${ev.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Guest checklist */}
                {isOpen && (
                  <div className="border-t border-border">
                    {noGuests ? (
                      <p className="px-5 py-6 text-center text-sm text-ink-soft">
                        Add guests on the{" "}
                        <a
                          href="/dashboard/guests"
                          className="font-medium text-gold-600 hover:underline"
                        >
                          Guests
                        </a>{" "}
                        page first, then check who&rsquo;s coming here.
                      </p>
                    ) : (
                      <ul className="divide-y divide-border">
                        {guests.map((g) => {
                          const on = attending.has(g.id);
                          return (
                            <li key={g.id}>
                              <label className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-cream-deep/40">
                                <input
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggleGuest(ev.id, g.id)}
                                  className="h-4 w-4 shrink-0 accent-forest-700"
                                />
                                <span className="flex-1 text-sm text-ink">
                                  {g.name}
                                </span>
                                <span className="text-xs text-ink-faint">
                                  {g.side} · {g.count}{" "}
                                  {g.count === 1 ? "person" : "people"}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      {/* Add-event dialog */}
      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 p-4">
          <div className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">Add an event</h2>
              <button
                type="button"
                onClick={() => setAdding(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-cream-deep"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">
                  Event name
                </span>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sangeet"
                  autoFocus
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">
                  Date (optional)
                </span>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="md" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={busy}
                onClick={() => addEvent(newName, newDate || null)}
              >
                <Plus className="h-4 w-4" /> Add event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
