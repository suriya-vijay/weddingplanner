"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X, Users, Check, Clock } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  guests as seed,
  type Guest,
  type RsvpStatus,
  type GuestSide,
  type MealPref,
} from "@/lib/mock-data";

const RSVP_ORDER: RsvpStatus[] = ["Confirmed", "Pending", "Declined"];
const RSVP_TONE: Record<RsvpStatus, string> = {
  Confirmed: "bg-forest-100 text-forest-700",
  Pending: "bg-gold-100 text-gold-700",
  Declined: "bg-cream-deep text-ink-soft",
};

const SIDES: GuestSide[] = ["Bride", "Groom", "Both"];
const MEALS: MealPref[] = ["Veg", "Non-veg", "Jain", "Vegan"];

export function GuestsView() {
  const [rows, setRows] = useState<Guest[]>(seed);
  const [adding, setAdding] = useState(false);
  const [sideFilter, setSideFilter] = useState<GuestSide | "All">("All");

  const totals = useMemo(() => {
    const invited = rows.reduce((s, g) => s + g.count, 0);
    const confirmed = rows
      .filter((g) => g.rsvp === "Confirmed")
      .reduce((s, g) => s + g.count, 0);
    const pending = rows
      .filter((g) => g.rsvp === "Pending")
      .reduce((s, g) => s + g.count, 0);
    const declined = rows
      .filter((g) => g.rsvp === "Declined")
      .reduce((s, g) => s + g.count, 0);
    return { invited, confirmed, pending, declined };
  }, [rows]);

  const visible = useMemo(
    () =>
      sideFilter === "All"
        ? rows
        : rows.filter((g) => g.side === sideFilter || g.side === "Both"),
    [rows, sideFilter],
  );

  const cycleRsvp = (id: string) =>
    setRows((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const next =
          RSVP_ORDER[(RSVP_ORDER.indexOf(g.rsvp) + 1) % RSVP_ORDER.length];
        return { ...g, rsvp: next };
      }),
    );

  const remove = (id: string) =>
    setRows((prev) => prev.filter((g) => g.id !== id));

  const add = (guest: Omit<Guest, "id">) =>
    setRows((prev) => [...prev, { ...guest, id: `g${Date.now()}` }]);

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
        <StatTile label="Total invited" value={totals.invited} icon={<Users className="h-[1.1rem] w-[1.1rem]" />} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-faint">
                <th className="pb-3 pr-4 font-medium">Guest / family</th>
                <th className="pb-3 pr-4 font-medium">Side</th>
                <th className="pb-3 pr-4 font-medium">Group</th>
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
                    <button
                      type="button"
                      onClick={() => remove(g.id)}
                      aria-label={`Remove ${g.name}`}
                      className="text-ink-faint transition-colors hover:text-maroon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-faint">
          Tip: click an RSVP badge to cycle Confirmed → Pending → Declined.
        </p>
      </Panel>

      {adding && <AddGuestDialog onClose={() => setAdding(false)} onAdd={add} />}
    </div>
  );
}

function AddGuestDialog({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (guest: Omit<Guest, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [count, setCount] = useState("1");
  const [side, setSide] = useState<GuestSide>("Bride");
  const [meal, setMeal] = useState<MealPref>("Veg");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: name.trim() || "New guest",
      group: group.trim() || "Guests",
      count: Math.max(1, Number(count) || 1),
      side,
      meal,
      rsvp: "Pending",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Add guest</h3>
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
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add guest
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
