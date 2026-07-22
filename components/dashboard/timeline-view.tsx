"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  Plus,
  Trash2,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, byDateThenSort } from "@/lib/utils";
import type { TimelineMilestone } from "@/lib/mock-data";
import {
  addTimelineAction,
  updateTimelineAction,
  deleteTimelineAction,
  suggestTimelineAction,
  reorderTimelineAction,
} from "@/app/(dashboard)/dashboard/actions";

function fmt(iso: string) {
  if (!iso) return "TBD";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TimelineView({
  initialItems,
  weddingDate,
}: {
  initialItems: TimelineMilestone[];
  weddingDate: string | null;
}) {
  const [items, setItems] = useState<TimelineMilestone[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const doneCount = items.filter((m) => m.status === "done").length;

  // Always render chronologically. Deriving (rather than sorting state) means a
  // date edit, an add, or an AI insert re-orders the list instantly.
  const ordered = useMemo(() => [...items].sort(byDateThenSort), [items]);

  /**
   * Move a milestone up/down within its tie-group. Dates drive the primary
   * order, so this only shuffles items that compare equal (same date, or both
   * undated) — we swap their `sort` values and persist the whole new order.
   */
  function move(id: string, dir: -1 | 1) {
    const i = ordered.findIndex((m) => m.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ordered.length) return;
    const a = ordered[i];
    const b = ordered[j];
    // Only reorder within a tie-group; different dates are date-ordered.
    if (byDateThenSort(a, b) !== 0 && (a.date || b.date) && a.date !== b.date)
      return;
    const next = [...ordered];
    next[i] = b;
    next[j] = a;
    const resorted = next.map((m, k) => ({ ...m, sort: k }));
    setItems(resorted);
    reorderTimelineAction(resorted.map((m) => m.id)).catch(() =>
      setItems(items),
    );
  }

  /** Can this row move within its tie-group? (dates otherwise decide order) */
  function canMove(id: string, dir: -1 | 1) {
    const i = ordered.findIndex((m) => m.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ordered.length) return false;
    return ordered[i].date === ordered[j].date;
  }

  function toggle(id: string) {
    const item = items.find((m) => m.id === id);
    if (!item) return;
    const next = item.status === "done" ? "upcoming" : "done";
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: next } : m)),
    );
    updateTimelineAction(id, { status: next }).catch(() =>
      setItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: item.status } : m)),
      ),
    );
  }

  function setDate(id: string, date: string) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, date } : m)));
    updateTimelineAction(id, { date });
  }

  function remove(id: string) {
    const snapshot = items;
    setItems((prev) => prev.filter((m) => m.id !== id));
    deleteTimelineAction(id).catch(() => setItems(snapshot));
  }

  async function add(draft: Omit<TimelineMilestone, "id">) {
    setAdding(false);
    const tempId = `temp-${items.length}-${draft.title}`;
    setItems((prev) => [...prev, { ...draft, id: tempId }]);
    const saved = await addTimelineAction(draft);
    setItems((prev) =>
      saved
        ? prev.map((m) => (m.id === tempId ? saved : m))
        : prev.filter((m) => m.id !== tempId),
    );
  }

  async function suggest() {
    setSuggesting(true);
    setNotice(null);
    const res = await suggestTimelineAction();
    setSuggesting(false);
    if (res.ok && res.milestones) {
      setItems((prev) => [...prev, ...res.milestones!]);
      setNotice(`Added ${res.milestones.length} suggested milestones — edit dates and details to make them yours.`);
    } else {
      setNotice(res.error ?? "Couldn't generate a timeline right now.");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Planning</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Timeline
          </h1>
          <p className="mt-1 text-ink-soft">
            {doneCount} of {items.length} milestones complete
            {weddingDate ? ` on the road to ${fmt(weddingDate)}` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="md" onClick={suggest} loading={suggesting}>
            <Sparkles className="h-4 w-4" /> Suggest a timeline
          </Button>
          <Button variant="primary" size="md" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add milestone
          </Button>
        </div>
      </header>

      {notice && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
          {notice}
        </p>
      )}

      <Panel>
        {items.length === 0 ? (
          <p className="py-8 text-center text-ink-soft">
            No milestones yet. Add your own, or let the AI suggest a starter
            timeline.
          </p>
        ) : (
          <ol className="relative ml-3 border-l border-border-strong">
            {ordered.map((m) => {
              const done = m.status === "done";
              return (
                <li key={m.id} className="group relative ml-8 pb-8 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-label={done ? "Mark as upcoming" : "Mark as done"}
                    className={cn(
                      "absolute -left-[2.85rem] grid h-7 w-7 place-items-center rounded-full border-2 transition-colors",
                      done
                        ? "border-forest-600 bg-forest-600 text-cream"
                        : "border-gold-400 bg-cream text-gold-600 hover:border-forest-600",
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-serif text-lg text-ink">{m.title}</h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={m.date}
                        onChange={(e) => setDate(m.id, e.target.value)}
                        aria-label={`Date for ${m.title}`}
                        className="rounded-lg border border-border-strong bg-ivory px-2 py-1 text-sm text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-1 focus:outline-gold-500"
                      />
                      {/* Reorder within a tie-group (same date / both undated);
                          different dates are ordered chronologically. */}
                      {(canMove(m.id, -1) || canMove(m.id, 1)) && (
                        <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => move(m.id, -1)}
                            disabled={!canMove(m.id, -1)}
                            aria-label={`Move ${m.title} earlier`}
                            className="grid h-8 w-6 place-items-center rounded-lg text-ink-soft hover:bg-cream-deep hover:text-forest-700 disabled:pointer-events-none disabled:opacity-30"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(m.id, 1)}
                            disabled={!canMove(m.id, 1)}
                            aria-label={`Move ${m.title} later`}
                            className="grid h-8 w-6 place-items-center rounded-lg text-ink-soft hover:bg-cream-deep hover:text-forest-700 disabled:pointer-events-none disabled:opacity-30"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(m.id)}
                        aria-label={`Delete ${m.title}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-soft opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {m.detail && (
                    <p className="mt-1 text-sm text-ink-soft">{m.detail}</p>
                  )}
                  {!done && (
                    <span className="mt-2 inline-block rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">
                      Upcoming
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </Panel>

      {adding && (
        <AddMilestoneDialog onClose={() => setAdding(false)} onAdd={add} />
      )}
    </div>
  );
}

function AddMilestoneDialog({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (m: Omit<TimelineMilestone, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-900/45" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add milestone"
        className="relative w-full max-w-md rounded-3xl bg-ivory p-6 shadow-[var(--shadow-lg)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Add milestone</h3>
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
            if (title.trim())
              onAdd({
                title: title.trim(),
                detail: detail.trim(),
                date,
                status: "upcoming",
              });
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Milestone</span>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Book the caterer"
              autoFocus
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Detail (optional)</span>
            <Input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="A short note"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Target date (optional)</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Add milestone
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
