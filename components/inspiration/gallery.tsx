"use client";

import { useMemo, useState } from "react";
import { Heart, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  inspirationItems,
  ceremonies,
  traditions,
  colorThemes,
  budgetTiers,
  locations,
  type InspirationItem,
} from "@/lib/mock-data";

type FilterKey = "ceremony" | "tradition" | "color" | "budget" | "location";

const FILTER_GROUPS: { key: FilterKey; label: string; options: readonly string[] }[] = [
  { key: "ceremony", label: "Ceremony", options: ceremonies },
  { key: "tradition", label: "Tradition", options: traditions },
  { key: "color", label: "Colour", options: colorThemes },
  { key: "budget", label: "Budget", options: budgetTiers },
  { key: "location", label: "Location", options: locations },
];

/**
 * Inspiration Gallery — Pinterest/Instagram feel. CSS-columns masonry (no JS
 * layout lib), client-side filtering of mock data, hover overlay with vendor
 * tags + a save-to-board heart (local state only; persistence comes later).
 * NO new animations beyond the existing card hover already in the design system.
 */
export function Gallery() {
  const [active, setActive] = useState<Partial<Record<FilterKey, string>>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [onlySaved, setOnlySaved] = useState(false);

  const items = useMemo(() => {
    return inspirationItems.filter((it) => {
      if (onlySaved && !saved.has(it.id)) return false;
      return (Object.keys(active) as FilterKey[]).every(
        (k) => !active[k] || String(it[k]) === active[k],
      );
    });
  }, [active, saved, onlySaved]);

  function toggleFilter(key: FilterKey, value: string) {
    setActive((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  }

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const activeCount = Object.values(active).filter(Boolean).length;

  return (
    <div>
      {/* Filter bar */}
      <div className="space-y-5">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className="flex flex-wrap items-center gap-2">
            <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              {group.label}
            </span>
            {group.options.map((opt) => {
              const isOn = active[group.key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleFilter(group.key, opt)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-[var(--dur-fast)] cursor-pointer",
                    isOn
                      ? "border-forest-700 bg-forest-700 text-cream"
                      : "border-border-strong bg-ivory text-ink-soft hover:border-gold-400 hover:text-forest-700",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Result bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
        <p className="text-sm text-ink-soft">
          <span className="font-serif text-lg text-forest-700">{items.length}</span>{" "}
          {items.length === 1 ? "inspiration" : "inspirations"}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setActive({})}
              className="ml-3 inline-flex items-center gap-1 text-gold-600 hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </p>
        <button
          type="button"
          onClick={() => setOnlySaved((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] cursor-pointer",
            onlySaved
              ? "border-blush-500 bg-blush-100 text-blush-600"
              : "border-border-strong text-ink-soft hover:border-blush-300",
          )}
        >
          <Heart className={cn("h-4 w-4", onlySaved && "fill-blush-500")} />
          Saved ({saved.size})
        </button>
      </div>

      {/* Masonry grid (CSS columns) */}
      {items.length > 0 ? (
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              saved={saved.has(item.id)}
              onSave={() => toggleSave(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-serif text-2xl text-ink">Nothing here yet</p>
          <p className="mt-2 text-ink-soft">
            Try removing a filter to see more inspiration.
          </p>
        </div>
      )}
    </div>
  );
}

function GalleryCard({
  item,
  saved,
  onSave,
}: {
  item: InspirationItem;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/70 shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]">
      {/* Plate (stand-in for photography), aspect-ratio reserves space (no CLS) */}
      <div
        aria-hidden
        className="transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        style={{ background: item.plate, aspectRatio: item.aspect }}
      />
      {/* Scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent"
      />

      {/* Save heart */}
      <button
        type="button"
        onClick={onSave}
        aria-label={saved ? "Remove from saved" : "Save to mood board"}
        aria-pressed={saved}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-forest-700 transition-colors hover:bg-cream cursor-pointer"
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            saved ? "fill-blush-500 text-blush-500" : "text-forest-700",
          )}
        />
      </button>

      {/* Caption + vendor tags */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-gold-400">
          {item.tradition} · {item.budget}
        </span>
        <h3 className="mt-1 font-serif text-xl text-cream">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-cream/75">
          <MapPin className="h-3.5 w-3.5" /> {item.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 transition-opacity duration-[var(--dur-base)] group-hover:opacity-100">
          {item.vendors.map((v) => (
            <span
              key={v}
              className="rounded-full bg-forest-900/35 px-2.5 py-1 text-xs text-cream"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
