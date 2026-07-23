"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Circle,
  Square,
  Utensils,
  DoorOpen,
  Bath,
  Tag,
  Trash2,
  Check,
  Users,
} from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import type { Guest } from "@/lib/mock-data";
import type {
  VenueData,
  VenueShape,
  VenueShapeType,
} from "@/lib/db/venue";
import { saveVenueAction } from "@/app/(dashboard)/dashboard/actions";

type PaletteItem = {
  type: VenueShapeType;
  label: string;
  icon: typeof Circle;
  w: number;
  h: number;
  seats?: number;
};

const PALETTE: PaletteItem[] = [
  { type: "table", label: "Table", icon: Circle, w: 90, h: 90, seats: 8 },
  { type: "stage", label: "Stage", icon: Square, w: 160, h: 80 },
  { type: "food", label: "Food", icon: Utensils, w: 100, h: 60 },
  { type: "restroom", label: "Restroom", icon: Bath, w: 80, h: 60 },
  { type: "entrance", label: "Entrance", icon: DoorOpen, w: 100, h: 50 },
  { type: "label", label: "Label", icon: Tag, w: 110, h: 44 },
];

const SHAPE_TONE: Record<VenueShapeType, string> = {
  table: "bg-forest-100 border-forest-300 text-forest-800",
  stage: "bg-gold-100 border-gold-300 text-gold-800",
  food: "bg-peacock/15 border-peacock/40 text-peacock",
  restroom: "bg-cream-deep border-border-strong text-ink-soft",
  entrance: "bg-blush-100 border-blush-300 text-ink",
  label: "bg-ivory border-border-strong text-ink",
};

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `s${idCounter}-${idCounter * 7}`;
}

export function VenueCanvas({
  guests,
  initialData,
  migrationReady,
}: {
  guests: Guest[];
  initialData: VenueData;
  migrationReady: boolean;
}) {
  const [shapes, setShapes] = useState<VenueShape[]>(initialData.shapes);
  // Drop seat assignments for guests that no longer exist. The layout is a
  // detached JSON blob with no FK to `guests`, so deleting a guest leaves a
  // dangling id behind; pruning on load lets the saved layout self-heal.
  const [seats, setSeats] = useState<Record<string, string[]>>(() => {
    const live = new Set(guests.map((g) => g.id));
    return Object.fromEntries(
      Object.entries(initialData.seats).map(([tableId, ids]) => [
        tableId,
        ids.filter((id) => live.has(id)),
      ]),
    );
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  // Debounced autosave whenever the layout changes (skip the first render).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!migrationReady) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveState("saving");
      const res = await saveVenueAction({ shapes, seats });
      setSaveState(res.ok ? "saved" : "idle");
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [shapes, seats, migrationReady]);

  const addShape = (p: PaletteItem) => {
    const shape: VenueShape = {
      id: newId(),
      type: p.type,
      x: 40,
      y: 40,
      w: p.w,
      h: p.h,
      label:
        p.type === "table"
          ? `Table ${shapes.filter((s) => s.type === "table").length + 1}`
          : p.label,
      seats: p.seats,
    };
    setShapes((prev) => [...prev, shape]);
    setSelected(shape.id);
  };

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const shape = shapes.find((s) => s.id === id);
    if (!shape) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      id,
      dx: e.clientX - rect.left - shape.x,
      dy: e.clientY - rect.top - shape.y,
    };
    setSelected(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { id, dx, dy } = drag.current;
    const x = Math.max(0, Math.min(e.clientX - rect.left - dx, rect.width - 20));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dy, rect.height - 20));
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const removeShape = (id: string) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    setSeats((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selected === id) setSelected(null);
  };

  const renameShape = (id: string, label: string) =>
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));

  const setCapacity = (id: string, seatsVal: number) =>
    setShapes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, seats: Math.max(1, seatsVal) } : s,
      ),
    );

  // Head-count sum for a table (a party of 3 counts as 3 seats).
  // Ignore ids that no longer match a guest. A deleted guest used to keep
  // occupying their seat forever: the roster row vanished (so it couldn't be
  // un-seated) but the `?? 1` fallback kept counting them, so a table showed
  // "6/8" with 5 people listed and refused new seating.
  const headcountAt = useCallback(
    (tableId: string) =>
      (seats[tableId] ?? []).reduce(
        (n, gid) => n + (guests.find((g) => g.id === gid)?.count ?? 0),
        0,
      ),
    [seats, guests],
  );

  // Seating: which guests are seated anywhere.
  const seatedIds = new Set(Object.values(seats).flat());
  const unseated = guests.filter((g) => !seatedIds.has(g.id));

  // Brief "table full" hint (tableId), auto-clears.
  const [fullHint, setFullHint] = useState<string | null>(null);

  const seatGuest = useCallback(
    (tableId: string, guestId: string) => {
      const table = shapes.find((s) => s.id === tableId);
      const guest = guests.find((g) => g.id === guestId);
      if (!table || !guest) return;
      const cap = table.seats ?? 8;
      const already = (seats[tableId] ?? []).includes(guestId);
      // Current head count minus this guest if they're already here (a no-op move).
      const current =
        (seats[tableId] ?? []).reduce(
          (n, gid) => n + (guests.find((g) => g.id === gid)?.count ?? 1),
          0,
        ) - (already ? guest.count : 0);
      if (current + guest.count > cap) {
        setFullHint(tableId);
        setTimeout(() => setFullHint(null), 1800);
        return; // reject: would exceed capacity
      }
      setSeats((prev) => {
        const next: Record<string, string[]> = {};
        // Remove from any table first (one seat per guest).
        for (const [tid, ids] of Object.entries(prev))
          next[tid] = ids.filter((x) => x !== guestId);
        next[tableId] = [...(next[tableId] ?? []), guestId];
        return next;
      });
    },
    [shapes, guests, seats],
  );

  const unseatGuest = (guestId: string) =>
    setSeats((prev) => {
      const next: Record<string, string[]> = {};
      for (const [tid, ids] of Object.entries(prev))
        next[tid] = ids.filter((x) => x !== guestId);
      return next;
    });

  const selectedShape = shapes.find((s) => s.id === selected) ?? null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Planning</p>
          <h1 className="mt-2 font-serif text-h1 text-ink">
            Venue & seating
          </h1>
          <p className="mt-1 text-ink-soft">
            Lay out tables, stages and spaces — then drag your guests onto
            tables.
          </p>
        </div>
        <span className="text-sm text-ink-faint">
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "All changes saved ✓"
              : ""}
        </span>
      </header>

      {!migrationReady && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
          Run migration <code>0007_venue_layout.sql</code> to save your layout.
          You can still experiment below — it just won&apos;t persist yet.
        </p>
      )}

      {/* Palette */}
      <Panel>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.type}
                type="button"
                onClick={() => addShape(p)}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-ivory px-3 py-2 text-sm text-ink-soft transition-colors hover:border-gold-400 hover:text-forest-700"
              >
                <Icon className="h-4 w-4" /> {p.label}
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
        {/* Canvas */}
        <div
          ref={canvasRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={() => setSelected(null)}
          className="relative h-[32rem] w-full overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle,theme(colors.border-strong)_1px,transparent_1px)] [background-size:24px_24px] bg-cream"
        >
          {shapes.length === 0 && (
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-ink-faint">
              Add a table or stage from the palette above.
            </p>
          )}
          {shapes.map((s) => {
            const isTable = s.type === "table";
            const seated = isTable ? headcountAt(s.id) : 0;
            const isFull = fullHint === s.id;
            return (
              <div
                key={s.id}
                onPointerDown={(e) => onPointerDown(e, s.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(s.id);
                }}
                onDragOver={(e) => isTable && e.preventDefault()}
                onDrop={(e) => {
                  if (!isTable) return;
                  e.preventDefault();
                  const gid = e.dataTransfer.getData("text/guest");
                  if (gid) seatGuest(s.id, gid);
                }}
                style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
                className={cn(
                  "absolute grid touch-none select-none place-items-center rounded-lg border-2 p-1 text-center text-xs font-medium shadow-[var(--shadow-xs)] cursor-grab active:cursor-grabbing",
                  isTable && "rounded-full",
                  SHAPE_TONE[s.type],
                  selected === s.id && "ring-2 ring-gold-500 ring-offset-1",
                  isFull && "ring-2 ring-destructive ring-offset-1",
                )}
              >
                <span className="pointer-events-none px-1 leading-tight">
                  {isFull ? "Table full" : s.label}
                  {isTable && (
                    <span className="mt-0.5 block text-[0.65rem] opacity-80">
                      {seated}/{s.seats ?? 8}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Sidebar: selected-shape editor + guest list */}
        <div className="space-y-4">
          {selectedShape && (
            <Panel>
              <h3 className="font-serif text-base text-ink">Selected</h3>
              <input
                value={selectedShape.label}
                onChange={(e) => renameShape(selectedShape.id, e.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-ivory px-3 text-sm text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-1 focus:outline-gold-500"
              />
              {selectedShape.type === "table" && (
                <div className="mt-3">
                  <label className="flex items-center justify-between gap-2 text-xs text-ink-soft">
                    <span>Seats at this table</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedShape.seats ?? 8}
                      onChange={(e) =>
                        setCapacity(
                          selectedShape.id,
                          Number(e.target.value) || 1,
                        )
                      }
                      className="h-8 w-16 rounded-md border border-border-strong bg-ivory px-2 text-sm text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-1 focus:outline-gold-500"
                    />
                  </label>
                  {/* Capacity can be lowered below who's already seated —
                      say so rather than silently rendering "8/2". */}
                  {headcountAt(selectedShape.id) >
                    (selectedShape.seats ?? 8) && (
                    <p className="mt-2 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                      {headcountAt(selectedShape.id)} seated but only{" "}
                      {selectedShape.seats ?? 8} seats — unseat someone or raise
                      the capacity.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-ink-faint">
                    Seated: {headcountAt(selectedShape.id)}/
                    {selectedShape.seats ?? 8} people
                  </p>
                  <ul className="mt-2 space-y-1">
                    {(seats[selectedShape.id] ?? []).map((gid) => {
                      const g = guests.find((x) => x.id === gid);
                      if (!g) return null;
                      return (
                        <li
                          key={gid}
                          className="flex items-center justify-between rounded-md bg-cream-deep/50 px-2 py-1 text-xs"
                        >
                          <span className="truncate">
                            {g.name}{" "}
                            <span className="text-ink-faint">×{g.count}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => unseatGuest(gid)}
                            aria-label={`Unseat ${g.name}`}
                            className="text-ink-faint hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeShape(selectedShape.id)}
                className="mt-3 inline-flex items-center gap-1 text-sm text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" /> Delete shape
              </button>
            </Panel>
          )}

          <Panel>
            <h3 className="flex items-center gap-2 font-serif text-base text-ink">
              <Users className="h-4 w-4 text-gold-600" /> Unseated guests
            </h3>
            <p className="mt-1 text-xs text-ink-faint">
              Drag onto a table to seat them.
            </p>
            <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto">
              {unseated.length === 0 ? (
                <li className="flex items-center gap-1 text-xs text-forest-700">
                  <Check className="h-3.5 w-3.5" /> Everyone is seated.
                </li>
              ) : (
                unseated.map((g) => (
                  <li
                    key={g.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/guest", g.id)
                    }
                    className="cursor-grab rounded-lg border border-border-strong bg-ivory px-2.5 py-1.5 text-xs text-ink active:cursor-grabbing"
                  >
                    {g.name}{" "}
                    <span className="text-ink-faint">×{g.count}</span>
                  </li>
                ))
              )}
            </ul>
            {guests.length === 0 && (
              <p className="mt-2 text-xs text-ink-faint">
                Add guests on the Guests page to seat them here.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
