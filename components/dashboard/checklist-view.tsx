"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Panel, ProgressBar } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import {
  checklistItems as seed,
  checklistPhases,
  type ChecklistItem,
} from "@/lib/mock-data";

export function ChecklistView() {
  const [items, setItems] = useState<ChecklistItem[]>(seed);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    );

  const doneCount = items.filter((c) => c.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

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
        <div className="w-full max-w-xs">
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-ink-soft">
              {doneCount} of {items.length} complete
            </span>
            <span className="font-medium text-ink">{pct}%</span>
          </div>
          <ProgressBar value={pct} />
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
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      aria-pressed={c.done}
                      className="flex w-full items-center gap-3 py-3 text-left"
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
                      <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-ink-soft">
                        {c.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
