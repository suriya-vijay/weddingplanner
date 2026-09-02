"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  CalendarHeart,
  ChevronDown,
  Users,
  Pencil,
  Clock,
  MapPin,
  Shirt,
} from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Guest } from "@/lib/mock-data";
import type { WeddingEvent, EventDetails } from "@/lib/db/events";
import {
  addEventAction,
  updateEventAction,
  deleteEventAction,
  setEventGuestAction,
} from "@/app/(dashboard)/dashboard/actions";

// A few common Indian-wedding functions to offer as quick-adds.
const SUGGESTIONS = ["Haldi", "Mehendi", "Sangeet", "Ceremony", "Reception"];

const EMPTY: EventDetails = {
  name: "",
  date: null,
  time: "",
  venue: "",
  address: "",
  dressCode: "",
  notes: "",
};

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
  // The dialog: `null` = closed, `{ id: null }` = adding, `{ id }` = editing.
  const [dialog, setDialog] = useState<{ id: string | null } | null>(null);
  const [form, setForm] = useState<EventDetails>(EMPTY);
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

  function openAdd(prefillName = "") {
    setForm({ ...EMPTY, name: prefillName });
    setDialog({ id: null });
  }
  function openEdit(ev: WeddingEvent) {
    setForm({
      name: ev.name,
      date: ev.date,
      time: ev.time,
      venue: ev.venue,
      address: ev.address,
      dressCode: ev.dressCode,
      notes: ev.notes,
    });
    setDialog({ id: ev.id });
  }

  const upd = (patch: Partial<EventDetails>) =>
    setForm((f) => ({ ...f, ...patch }));

  async function save() {
    if (!form.name.trim() || busy) return;
    setBusy(true);
    const details: EventDetails = { ...form, name: form.name.trim() };

    if (dialog?.id) {
      // EDIT — optimistic update, then persist.
      const id = dialog.id;
      const prev = events;
      setEvents((e) => e.map((x) => (x.id === id ? { ...x, ...details } : x)));
      setDialog(null);
      setBusy(false);
      try {
        await updateEventAction(id, details);
      } catch {
        setEvents(prev); // rollback
      }
    } else {
      // ADD
      const sort = events.length;
      const created = await addEventAction(details, sort);
      setBusy(false);
      if (!created) return;
      setEvents((e) => [...e, created]);
      setAttend((a) => ({ ...a, [created.id]: new Set() }));
      setDialog(null);
      setOpen(created.id);
    }
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
          Create each function with all its details, choose who&rsquo;s invited,
          and it&rsquo;s ready for your wedding invitation.
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
              onClick={() => openAdd(s)}
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
          onClick={() => openAdd()}
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
              <Button variant="primary" size="md" onClick={() => openAdd()}>
                <Plus className="h-4 w-4" /> Add your first event
              </Button>
            }
          >
            Add each function — Haldi, Mehendi, Sangeet, the ceremony, the
            reception — with its date, time, venue and dress code, then check off
            who&rsquo;s invited to each.
          </EmptyState>
        </Panel>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const isOpen = open === ev.id;
            const count = headcount(ev.id);
            const attending = attend[ev.id] ?? new Set<string>();
            const meta = [ev.date, ev.time, ev.venue].filter(Boolean).join(" · ");
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
                        {meta ? ` · ${meta}` : ""}
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
                    onClick={() => openEdit(ev)}
                    aria-label={`Edit ${ev.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-cream-deep hover:text-forest-700"
                  >
                    <Pencil className="h-4 w-4" />
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

                {isOpen && (
                  <div className="border-t border-border">
                    {/* Invitation details (the source-of-truth for the digital
                        invite later). Only show what's filled in. */}
                    {(ev.venue ||
                      ev.address ||
                      ev.dressCode ||
                      ev.time ||
                      ev.notes) && (
                      <dl className="grid gap-x-8 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2">
                        {ev.time && (
                          <Detail icon={<Clock className="h-4 w-4" />} label="Time">
                            {ev.time}
                          </Detail>
                        )}
                        {(ev.venue || ev.address) && (
                          <Detail
                            icon={<MapPin className="h-4 w-4" />}
                            label="Location"
                          >
                            {ev.venue && <span className="block">{ev.venue}</span>}
                            {ev.address && (
                              <span className="block text-ink-soft">
                                {ev.address}
                              </span>
                            )}
                          </Detail>
                        )}
                        {ev.dressCode && (
                          <Detail
                            icon={<Shirt className="h-4 w-4" />}
                            label="Dress code"
                          >
                            {ev.dressCode}
                          </Detail>
                        )}
                        {ev.notes && (
                          <Detail
                            icon={<CalendarHeart className="h-4 w-4" />}
                            label="Notes"
                            className="sm:col-span-2"
                          >
                            {ev.notes}
                          </Detail>
                        )}
                      </dl>
                    )}

                    {/* Guest checklist */}
                    <div className="border-t border-border">
                      <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                        Who&rsquo;s invited
                      </p>
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
                        <ul className="mt-1 divide-y divide-border">
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
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      {/* Add / Edit dialog — all invitation fields */}
      {dialog && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 p-4">
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-6 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">
                {dialog.id ? "Edit event" : "Add an event"}
              </h2>
              <button
                type="button"
                onClick={() => setDialog(null)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-cream-deep"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Event name" className="sm:col-span-2">
                <Input
                  value={form.name}
                  onChange={(e) => upd({ name: e.target.value })}
                  placeholder="e.g. Sangeet"
                  autoFocus
                />
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={form.date ?? ""}
                  onChange={(e) => upd({ date: e.target.value || null })}
                />
              </Field>
              <Field label="Start time">
                <Input
                  value={form.time}
                  onChange={(e) => upd({ time: e.target.value })}
                  placeholder="e.g. 4:00 PM"
                />
              </Field>
              <Field label="Venue name" className="sm:col-span-2">
                <Input
                  value={form.venue}
                  onChange={(e) => upd({ venue: e.target.value })}
                  placeholder="e.g. The Grand Ballroom"
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <textarea
                  value={form.address}
                  onChange={(e) => upd({ address: e.target.value })}
                  placeholder="Street, City, State ZIP"
                  rows={2}
                  className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
                />
              </Field>
              <Field label="Dress code" className="sm:col-span-2">
                <Input
                  value={form.dressCode}
                  onChange={(e) => upd({ dressCode: e.target.value })}
                  placeholder="e.g. Traditional Indian · Festive"
                />
              </Field>
              <Field label="Additional notes" className="sm:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={(e) => upd({ notes: e.target.value })}
                  placeholder="Anything guests should know (parking, gifts, timing…)"
                  rows={3}
                  className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="md" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={busy}
                onClick={save}
              >
                {dialog.id ? "Save changes" : (
                  <>
                    <Plus className="h-4 w-4" /> Add event
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function Detail({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="mt-0.5 shrink-0 text-gold-600" aria-hidden>
        {icon}
      </span>
      <div>
        <span className="block text-xs uppercase tracking-wider text-ink-faint">
          {label}
        </span>
        <span className="text-ink">{children}</span>
      </div>
    </div>
  );
}
