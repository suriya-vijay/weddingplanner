"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Panel, StatTile, ProgressBar } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatINR } from "@/lib/utils";
import {
  budgetItems as seed,
  weddingProfile,
  type BudgetItem,
} from "@/lib/mock-data";

const STATUS_TONE: Record<BudgetItem["status"], string> = {
  Paid: "bg-forest-100 text-forest-700",
  "Deposit paid": "bg-gold-100 text-gold-700",
  "Not started": "bg-cream-deep text-ink-soft",
};

export function BudgetView() {
  const [items, setItems] = useState<BudgetItem[]>(seed);
  const [adding, setAdding] = useState(false);

  const totalEstimated = items.reduce((s, b) => s + b.estimated, 0);
  const totalSpent = items.reduce((s, b) => s + b.spent, 0);
  const remaining = weddingProfile.totalBudget - totalSpent;
  const budgetPct = Math.round((totalSpent / weddingProfile.totalBudget) * 100);

  // category rollup for the bars (React Compiler memoizes this automatically)
  const byCategory = ((): [string, { estimated: number; spent: number }][] => {
    const map = new Map<string, { estimated: number; spent: number }>();
    for (const b of items) {
      const cur = map.get(b.category) ?? { estimated: 0, spent: 0 };
      map.set(b.category, {
        estimated: cur.estimated + b.estimated,
        spent: cur.spent + b.spent,
      });
    }
    return [...map.entries()].sort((a, b) => b[1].estimated - a[1].estimated);
  })();

  const remove = (id: string) =>
    setItems((prev) => prev.filter((b) => b.id !== id));

  const add = (item: Omit<BudgetItem, "id">) =>
    setItems((prev) => [...prev, { ...item, id: `b${Date.now()}` }]);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Budget</h1>
        <p className="mt-1 text-ink-soft">
          Track every allocation and payment against your{" "}
          {formatINR(weddingProfile.totalBudget)} budget.
        </p>
      </header>

      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total budget" value={formatINR(weddingProfile.totalBudget)} />
        <StatTile label="Committed" value={formatINR(totalEstimated)} sub="planned across vendors" />
        <StatTile label="Spent" value={formatINR(totalSpent)} sub={`${budgetPct}% of budget`} />
        <StatTile
          label="Remaining"
          value={formatINR(remaining)}
          sub={remaining < 0 ? "over budget" : "still available"}
        />
      </div>

      {/* Overall bar */}
      <Panel>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-ink-soft">Budget used</span>
          <span className="font-medium text-ink">
            {formatINR(totalSpent)} / {formatINR(weddingProfile.totalBudget)}
          </span>
        </div>
        <ProgressBar value={budgetPct} />
      </Panel>

      {/* Category breakdown */}
      <Panel>
        <h2 className="font-serif text-xl text-ink">By category</h2>
        <div className="mt-5 space-y-4">
          {byCategory.map(([cat, v]) => {
            const pct = totalEstimated
              ? Math.round((v.estimated / totalEstimated) * 100)
              : 0;
            return (
              <div key={cat}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="text-ink">{cat}</span>
                  <span className="text-ink-soft">
                    {formatINR(v.spent)}{" "}
                    <span className="text-ink-faint">/ {formatINR(v.estimated)}</span>
                  </span>
                </div>
                <ProgressBar
                  value={v.estimated ? (v.spent / v.estimated) * 100 : 0}
                  tone="forest"
                />
                <p className="mt-1 text-xs text-ink-faint">{pct}% of committed budget</p>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Line items */}
      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">Line items</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-4 w-4" /> Add item
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-faint">
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Item</th>
                <th className="pb-3 pr-4 text-right font-medium">Estimated</th>
                <th className="pb-3 pr-4 text-right font-medium">Spent</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {items.map((b) => (
                <tr key={b.id} className="text-ink">
                  <td className="py-3 pr-4 text-ink-soft">{b.category}</td>
                  <td className="py-3 pr-4">{b.label}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">
                    {formatINR(b.estimated)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">
                    {formatINR(b.spent)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                        STATUS_TONE[b.status],
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      aria-label={`Remove ${b.label}`}
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
      </Panel>

      {adding && <AddItemDialog onClose={() => setAdding(false)} onAdd={add} />}
    </div>
  );
}

function AddItemDialog({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Omit<BudgetItem, "id">) => void;
}) {
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [estimated, setEstimated] = useState("");
  const [spent, setSpent] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      category: category.trim() || "Other",
      label: label.trim() || "Untitled item",
      estimated: Number(estimated) || 0,
      spent: Number(spent) || 0,
      status: Number(spent) > 0 ? "Deposit paid" : "Not started",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Add budget item</h3>
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
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Florals" />
          </Field>
          <Field label="Item">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Description" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimated (₹)">
              <Input
                type="number"
                inputMode="numeric"
                value={estimated}
                onChange={(e) => setEstimated(e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Spent (₹)">
              <Input
                type="number"
                inputMode="numeric"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add item
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
