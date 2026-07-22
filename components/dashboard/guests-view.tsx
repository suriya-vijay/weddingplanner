"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X, Users, Check, Clock, Pencil } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  type Guest,
  type RsvpStatus,
  type GuestSide,
  type MealPref,
} from "@/lib/mock-data";
import {
  addGuestAction,
  updateGuestAction,
  deleteGuestAction,
} from "@/app/(dashboard)/dashboard/actions";

const RSVP_ORDER: RsvpStatus[] = ["Confirmed", "Pending", "Declined"];
const RSVP_TONE: Record<RsvpStatus, string> = {
  Confirmed: "bg-forest-100 text-forest-700",
  Pending: "bg-gold-100 text-gold-700",
  Declined: "bg-cream-deep text-ink-soft",
};

const SIDES: GuestSide[] = ["Bride", "Groom", "Both"];
const MEALS: MealPref[] = ["Veg", "Non-veg", "Jain", "Vegan"];

export function GuestsView({ initialGuests }: { initialGuests: Guest[] }) {
  const [rows, setRows] = useState<Guest[]>(initialGuests);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [sideFilter, setSideFilter] = useState<GuestSide | "All">("All");

  /** Correct a guest in place (misspelled name, wrong party size, etc.). */
  const saveEdit = (id: string, patch: Omit<Guest, "id">) => {
    const snapshot = rows;
    setEditing(null);
    setRows((prev) => prev.map((g) => (g.id === id ? { ...patch, id } : g)));
    updateGuestAction(id, patch).catch(() => setRows(snapshot));
  };

  const visible = useMemo(
    () =>
      sideFilter === "All"
        ? rows
        : rows.filter((g) => g.side === sideFilter || g.side === "Both"),
    [rows, sideFilter],
  );

  // Totals follow the filter, so the tiles always describe the rows on screen.
  // (They used to read from `rows`, so picking "Bride" shrank the table but
  // left "Total invited" showing the whole wedding.)
  const totals = useMemo(() => {
    const headcount = (list: Guest[]) =>
      list.reduce((s, g) => s + g.count, 0);
    return {
      invited: headcount(visible),
      confirmed: headcount(visible.filter((g) => g.rsvp === "Confirmed")),
      pending: headcount(visible.filter((g) => g.rsvp === "Pending")),
      declined: headcount(visible.filter((g) => g.rsvp === "Declined")),
    };
  }, [visible]);

  const cycleRsvp = (id: string) => {
    const g = rows.find((r) => r.id === id);
    if (!g) return;
    const next =
      RSVP_ORDER[(RSVP_ORDER.indexOf(g.rsvp) + 1) % RSVP_ORDER.length];
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, rsvp: next } : r)));
    updateGuestAction(id, { rsvp: next }).catch(() =>
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, rsvp: g.rsvp } : r))),
    );
  };

  const remove = (id: string) => {
    const snapshot = rows;
    setRows((prev) => prev.filter((g) => g.id !== id));
    deleteGuestAction(id).catch(() => setRows(snapshot));
  };

  const add = async (guest: Omit<Guest, "id">) => {
    // Optimistic temp row, reconciled with the DB id on return.
    const tempId = `temp-${Date.now()}`;
    setRows((prev) => [...prev, { ...guest, id: tempId }]);
    const saved = await addGuestAction(guest);
    setRows((prev) =>
      saved
        ? prev.map((g) => (g.id === tempId ? saved : g))
        : prev.filter((g) => g.id !== tempId),
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Guest list</h1>
        <p className="mt-1 text-ink-soft">
          Track families, RSVPs and meal preferences across both sides.
        </p>
      </header>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* These count PEOPLE (party sizes summed), while the table lists
            parties — state the unit so 5 rows reading "40" makes sense. */}
        <StatTile
          label="Total invited"
          value={totals.invited}
          sub={`${visible.length} ${visible.length === 1 ? "party" : "parties"}${sideFilter === "All" ? "" : ` · ${sideFilter}`}`}
          icon={<Users className="h-[1.1rem] w-[1.1rem]" />}
        />
        <StatTile label="Confirmed" value={totals.confirmed} icon={<Check className="h-[1.1rem] w-[1.1rem]" />} />
        <StatTile label="Pending" value={totals.pending} icon={<Clock className="h-[1.1rem] w-[1.1rem]" />} />
        <StatTile label="Declined" value={totals.declined} />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2.5">
          {(["All", ...SIDES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSideFilter(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-fast)]",
                sideFilter === s
                  ? "border-forest-700 bg-forest-700 text-cream"
                  : "border-border-strong bg-ivory text-ink-soft hover:border-gold-400 hover:text-forest-700",
              )}
            >
              {s === "All" ? "All sides" : s}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add guest
        </Button>
      </div>

      {/* Table */}
      <Panel>
        {rows.length === 0 ? (
          <EmptyState
            bare
            icon={<Users className="h-6 w-6" />}
            title="No guests yet"
            action={
              <Button variant="primary" size="md" onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add your first guest
              </Button>
            }
          >
            Add families or individuals, track their RSVP and meal
            preferences, and seat them later from the Seating page.
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState
            bare
            icon={<Users className="h-6 w-6" />}
            title="No guests match this filter"
          >
            Try a different side, or clear the filter to see everyone.
          </EmptyState>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-faint">
                <th className="pb-3 pr-4 font-medium">Guest / family</th>
                <th className="pb-3 pr-4 font-medium">Side</th>
                <th className="pb-3 pr-4 font-medium">Group</th>
                <th className="pb-3 pr-4 font-medium">Contact</th>
                <th className="pb-3 pr-4 text-right font-medium">Count</th>
                <th className="pb-3 pr-4 font-medium">Meal</th>
                <th className="pb-3 pr-4 font-medium">RSVP</th>
                <th className="pb-3 font-medium" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {visible.map((g) => (
                <tr key={g.id} className="text-ink">
                  <td className="py-3 pr-4 font-medium">{g.name}</td>
                  <td className="py-3 pr-4 text-ink-soft">{g.side}</td>
                  <td className="py-3 pr-4 text-ink-soft">{g.group}</td>
                  <td className="py-3 pr-4 text-ink-soft">
                    {g.email || g.phone ? (
                      <div className="flex flex-col leading-tight">
                        {g.email && <span className="text-xs">{g.email}</span>}
                        {g.phone && (
                          <span className="text-xs text-ink-faint">{g.phone}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">{g.count}</td>
                  <td className="py-3 pr-4 text-ink-soft">{g.meal}</td>
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => cycleRsvp(g.id)}
                      title="Click to change RSVP"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                        RSVP_TONE[g.rsvp],
                      )}
                    >
                      {g.rsvp}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(g)}
                      aria-label={`Edit ${g.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-forest-700/[0.06] hover:text-forest-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(g.id)}
                      aria-label={`Remove ${g.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {/* Only meaningful when there are badges on screen to click. */}
        {visible.length > 0 && (
          <p className="mt-4 text-xs text-ink-faint">
            Tip: click an RSVP badge to cycle Confirmed → Pending → Declined.
          </p>
        )}
      </Panel>

      {adding && <AddGuestDialog onClose={() => setAdding(false)} onAdd={add} />}
      {editing && (
        <AddGuestDialog
          key={editing.id}
          initial={editing}
          onClose={() => setEditing(null)}
          onAdd={(patch) => saveEdit(editing.id, patch)}
        />
      )}
    </div>
  );
}

/** One dialog for add AND edit — pass `initial` to correct an existing guest. */
function AddGuestDialog({
  onClose,
  onAdd,
  initial,
}: {
  onClose: () => void;
  onAdd: (guest: Omit<Guest, "id">) => void;
  initial?: Guest;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState(initial?.group ?? "");
  const [count, setCount] = useState(initial ? String(initial.count) : "1");
  const [side, setSide] = useState<GuestSide>(initial?.side ?? "Bride");
  const [meal, setMeal] = useState<MealPref>(initial?.meal ?? "Veg");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: name.trim() || "New guest",
      group: group.trim() || "Guests",
      count: Math.max(1, Number(count) || 1),
      side,
      meal,
      // Keep the RSVP already recorded when editing — correcting a typo in
      // someone's name must not silently reset them to Pending.
      rsvp: initial?.rsvp ?? "Pending",
      email: email.trim(),
      phone: phone.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">
            {isEdit ? "Edit guest" : "Add guest"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Guest / family name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Sharmas" />
          </Field>
          <Field label="Group">
            <Input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="e.g. Relatives" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Side">
              <Select value={side} onChange={(e) => setSide(e.target.value as GuestSide)}>
                {SIDES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Head count">
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Meal preference">
            <Select value={meal} onChange={(e) => setMeal(e.target.value as MealPref)}>
              {MEALS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email (optional)">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </Field>
            <Field label="Phone (optional)">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {isEdit ? "Save changes" : "Add guest"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
      {...props}
    >
      {children}
    </select>
  );
}
