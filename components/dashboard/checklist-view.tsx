"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Panel, ProgressBar } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  checklistPhases,
  type ChecklistItem,
  type ChecklistPhase,
} from "@/lib/mock-data";
import {
  setChecklistDoneAction,
  addChecklistItemAction,
  deleteChecklistItemAction,
} from "@/app/(dashboard)/dashboard/actions";

export function ChecklistView({
  initialItems,
}: {
  initialItems: ChecklistItem[];
}) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [adding, setAdding] = useState(false);

  const toggle = (id: string) => {
    const item = items.find((c) => c.id === id);
    if (!item) return;
    const next = !item.done;
    // Optimistic: flip locally now, persist in the background.
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: next } : c)),
    );
    setChecklistDoneAction(id, next).catch(() => {
      // Revert on failure.
      setItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, done: !next } : c)),
      );
    });
  };

  const remove = (id: string) => {
    const snapshot = items;
    setItems((prev) => prev.filter((c) => c.id !== id));
    deleteChecklistItemAction(id).catch(() => setItems(snapshot));
  };

  const add = async (draft: Pick<ChecklistItem, "task" | "phase" | "category">) => {
    setAdding(false);
    const tempId = `temp-${draft.task}-${items.length}`;
    const optimistic: ChecklistItem = { ...draft, id: tempId, done: false };
    setItems((prev) => [...prev, optimistic]);
    const saved = await addChecklistItemAction(draft);
    setItems((prev) =>
      saved
        ? prev.map((c) => (c.id === tempId ? saved : c))
        : prev.filter((c) => c.id !== tempId),
    );
  };

  const doneCount = items.filter((c) => c.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const visible = useMemo(
    () =>
      items.filter((c) =>
        filter === "all" ? true : filter === "done" ? c.done : !c.done,
      ),
    [items, filter],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Planning</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Your checklist
          </h1>
          <p className="mt-1 text-ink-soft">
            A guided list tuned to your traditions and ceremonies — tick things
            off as you go.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="text-ink-soft">
                {doneCount} of {items.length} complete
              </span>
              <span className="font-medium text-ink">{pct}%</span>
            </div>
            <ProgressBar value={pct} />
          </div>
          <Button
            variant="primary"
            size="sm"
            className="self-start"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-4 w-4" /> Add task
          </Button>
        </div>
      </header>

      {/* Filter */}
      <div className="flex flex-wrap gap-2.5">
        {(
          [
            { key: "all", label: "All" },
            { key: "todo", label: "To do" },
            { key: "done", label: "Completed" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-fast)]",
              filter === f.key
                ? "border-forest-700 bg-forest-700 text-cream"
                : "border-border-strong bg-ivory text-ink-soft hover:border-gold-400 hover:text-forest-700",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped by phase */}
      <div className="space-y-6">
        {checklistPhases.map((phase) => {
          const phaseItems = visible.filter((c) => c.phase === phase);
          if (phaseItems.length === 0) return null;
          return (
            <Panel key={phase}>
              <h2 className="font-serif text-lg text-ink">{phase}</h2>
              <ul className="mt-4 divide-y divide-border/70">
                {phaseItems.map((c) => (
                  <li key={c.id} className="group flex items-center gap-3 py-3">
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      aria-pressed={c.done}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors duration-[var(--dur-fast)]",
                          c.done
                            ? "border-forest-600 bg-forest-600 text-cream"
                            : "border-border-strong text-transparent",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          c.done
                            ? "text-ink-faint line-through"
                            : "text-ink",
                        )}
                      >
                        {c.task}
                      </span>
                    </button>
                    <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-ink-soft">
                      {c.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      aria-label={`Delete ${c.task}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-soft opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
        {visible.length === 0 && (
          <Panel>
            <p className="py-6 text-center text-ink-soft">
              No tasks here yet. Click “Add task” to create your own.
            </p>
          </Panel>
        )}
      </div>

      {adding && (
        <AddTaskDialog onClose={() => setAdding(false)} onAdd={add} />
      )}
    </div>
  );
}

const CATEGORIES = [
  "Planning",
  "Venue",
  "Vendors",
  "Guests",
  "Catering",
  "Fashion",
  "Beauty",
  "Ceremonies",
  "Personal",
];

function AddTaskDialog({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (m: Pick<ChecklistItem, "task" | "phase" | "category">) => void;
}) {
  const [task, setTask] = useState("");
  const [phase, setPhase] = useState<ChecklistPhase>(checklistPhases[0]);
  const [category, setCategory] = useState("Personal");

  const selectClass =
    "h-12 w-full rounded-xl border border-border-strong bg-ivory px-3 text-[0.95rem] text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-900/45" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add task"
        className="relative w-full max-w-md rounded-3xl bg-ivory p-6 shadow-[var(--shadow-lg)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Add task</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (task.trim()) onAdd({ task: task.trim(), phase, category });
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Task</span>
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Order custom invitations"
              autoFocus
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Phase</span>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as ChecklistPhase)}
                className={selectClass}
              >
                {checklistPhases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Add task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
