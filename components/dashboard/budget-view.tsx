"use client";

import { useState } from "react";
import { Plus, Trash2, X, Wallet, Pencil } from "lucide-react";
import { Panel, StatTile, ProgressBar } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn, formatINR } from "@/lib/utils";
import { type BudgetItem } from "@/lib/mock-data";
import {
  addBudgetItemAction,
  updateBudgetItemAction,
  deleteBudgetItemAction,
} from "@/app/(dashboard)/dashboard/actions";

const STATUS_TONE: Record<BudgetItem["status"], string> = {
  Paid: "bg-forest-100 text-forest-700",
  "Deposit paid": "bg-gold-100 text-gold-700",
  "Not started": "bg-cream-deep text-ink-soft",
};

export function BudgetView({
  initialItems,
  totalBudget,
}: {
  initialItems: BudgetItem[];
  totalBudget: number;
}) {
  const [items, setItems] = useState<BudgetItem[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  /** Correct an item in place. `updateBudgetItem` existed but was never wired. */
  const saveEdit = (id: string, patch: Omit<BudgetItem, "id">) => {
    const snapshot = items;
    setEditing(null);
    setItems((prev) => prev.map((b) => (b.id === id ? { ...patch, id } : b)));
    updateBudgetItemAction(id, patch).catch(() => setItems(snapshot));
  };

  const totalEstimated = items.reduce((s, b) => s + b.estimated, 0);
  const totalSpent = items.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const hasBudget = totalBudget > 0;
  const budgetPct = hasBudget
    ? Math.round((totalSpent / totalBudget) * 100)
    : 0;
  const overBudget = hasBudget && totalSpent > totalBudget;

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

  const remove = (id: string) => {
    const snapshot = items;
    setItems((prev) => prev.filter((b) => b.id !== id));
    deleteBudgetItemAction(id).catch(() => setItems(snapshot));
  };

  const add = async (item: Omit<BudgetItem, "id">) => {
    const tempId = `temp-${Date.now()}`;
    setItems((prev) => [...prev, { ...item, id: tempId }]);
    const saved = await addBudgetItemAction(item);
    setItems((prev) =>
      saved
        ? prev.map((b) => (b.id === tempId ? saved : b))
        : prev.filter((b) => b.id !== tempId),
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-h1 text-ink">Budget</h1>
        <p className="mt-1 text-ink-soft">
          {hasBudget
            ? `Plan what you expect to spend, then record what you've actually paid — against your ${formatINR(totalBudget)} budget.`
            : "Plan what you expect to spend, then record what you've actually paid."}
        </p>
      </header>

      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total budget" value={formatINR(totalBudget)} />
        {/* "Committed" implied a contractual obligation; these are the
            couple's own estimates. */}
        <StatTile
          label="Planned"
          value={formatINR(totalEstimated)}
          sub="your estimates"
        />
        <StatTile
          label="Spent"
          value={formatINR(totalSpent)}
          // "0% of budget" next to real spending is nonsense; say why instead.
          sub={hasBudget ? `${budgetPct}% of budget` : "no budget set"}
        />
        <StatTile
          label="Remaining"
          value={hasBudget ? formatINR(remaining) : "—"}
          sub={
            !hasBudget
              ? "set a total to track this"
              : remaining < 0
                ? "over budget"
                : "still available"
          }
        />
      </div>

      {/* Overall bar — or a prompt, since the total lives on Settings and
          isn't discoverable from here. */}
      <Panel>
        {hasBudget ? (
          <>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-ink-soft">Budget used</span>
              <span
                className={cn(
                  "font-medium",
                  overBudget ? "text-destructive" : "text-ink",
                )}
              >
                {formatINR(totalSpent)} / {formatINR(totalBudget)}
                {overBudget && ` · ${formatINR(totalSpent - totalBudget)} over`}
              </span>
            </div>
            <ProgressBar value={budgetPct} tone={overBudget ? "over" : "gold"} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm text-ink-soft">
              You haven&rsquo;t set a total budget yet, so there&rsquo;s nothing
              to track spending against.
            </p>
            <Button href="/dashboard/settings" variant="outline" size="sm">
              Set your total budget
            </Button>
          </div>
        )}
      </Panel>

      {/* Category breakdown — hidden until there's something to break down
          (it used to render a lone heading above nothing). */}
      {items.length > 0 && (
      <Panel>
        <h2 className="font-serif text-xl text-ink">By category</h2>
        <div className="mt-5 space-y-4">
          {byCategory.map(([cat, v]) => {
            // The bar shows spent-vs-planned for THIS category. The caption
            // must describe the same thing — it used to show the category's
            // share of total planned spend, so a full bar sat under "29%".
            const share = totalEstimated
              ? Math.round((v.estimated / totalEstimated) * 100)
              : 0;
            const spentPct = v.estimated
              ? Math.round((v.spent / v.estimated) * 100)
              : 0;
            const over = v.spent > v.estimated;
            return (
              <div key={cat}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="text-ink transition-colors duration-[var(--dur-fast)] hover:bg-cream-deep/50">{cat}</span>
                  <span className={over ? "text-destructive" : "text-ink-soft"}>
                    {formatINR(v.spent)}{" "}
                    <span className={over ? "" : "text-ink-faint"}>
                      / {formatINR(v.estimated)} planned
                    </span>
                  </span>
                </div>
                <ProgressBar
                  value={spentPct}
                  tone={over ? "over" : "forest"}
                />
                <p className="mt-1 text-xs text-ink-faint">
                  {over
                    ? `${formatINR(v.spent - v.estimated)} over plan`
                    : `${spentPct}% of this category spent`}
                  {" · "}
                  {share}% of your total plan
                </p>
              </div>
            );
          })}
        </div>
      </Panel>
      )}

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

        {items.length === 0 ? (
          <EmptyState
            bare
            icon={<Wallet className="h-6 w-6" />}
            title="No budget items yet"
            action={
              <Button variant="primary" size="md" onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add your first item
              </Button>
            }
          >
            Track what you plan to spend and what you&rsquo;ve actually paid —
            venue, catering, outfits, everything.
          </EmptyState>
        ) : (
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
                <tr key={b.id} className="text-ink transition-colors duration-[var(--dur-fast)] hover:bg-cream-deep/50">
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
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(b)}
                        aria-label={`Edit ${b.label}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-forest-700/[0.06] hover:text-forest-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(b.id)}
                        aria-label={`Remove ${b.label}`}
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
      </Panel>

      {adding && <AddItemDialog onClose={() => setAdding(false)} onAdd={add} />}
      {editing && (
        <AddItemDialog
          key={editing.id}
          initial={editing}
          onClose={() => setEditing(null)}
          onAdd={(patch) => saveEdit(editing.id, patch)}
        />
      )}
    </div>
  );
}

/**
 * One dialog for add AND edit — pass `initial` to edit. Amounts are the most
 * likely thing to get typed wrong, so they must be correctable in place.
 */
function AddItemDialog({
  onClose,
  onAdd,
  initial,
}: {
  onClose: () => void;
  onAdd: (item: Omit<BudgetItem, "id">) => void;
  initial?: BudgetItem;
}) {
  const isEdit = !!initial;
  const [category, setCategory] = useState(initial?.category ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [estimated, setEstimated] = useState(
    initial ? String(initial.estimated) : "",
  );
  const [spent, setSpent] = useState(initial ? String(initial.spent) : "");
  const [status, setStatus] = useState<BudgetItem["status"]>(
    initial?.status ?? "Not started",
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      category: category.trim() || "Other",
      label: label.trim() || "Untitled item",
      estimated: Number(estimated) || 0,
      spent: Number(spent) || 0,
      // On add, infer from whether anything's been paid; on edit, respect the
      // couple's explicit choice.
      status: isEdit
        ? status
        : Number(spent) > 0
          ? "Deposit paid"
          : "Not started",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">
            {isEdit ? "Edit budget item" : "Add budget item"}
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
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Florals" />
          </Field>
          <Field label="Item">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Description" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimated ($)">
              <Input
                type="number"
                inputMode="numeric"
                value={estimated}
                onChange={(e) => setEstimated(e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Spent ($)">
              <Input
                type="number"
                inputMode="numeric"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
          {isEdit && (
            <Field label="Status">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as BudgetItem["status"])
                }
                className="h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
              >
                {(["Not started", "Deposit paid", "Paid"] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {isEdit ? "Save changes" : "Add item"}
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
