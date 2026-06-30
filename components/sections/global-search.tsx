"use client";

import { useState } from "react";
import { MapPin, Sparkles, Store, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Airbnb-style global search (UX Bible §6) — visual + mock only this phase.
 * Pill-shaped, ivory, segmented; active segment lifts with a blush wash and
 * gold ring on focus.
 */
const SEGMENTS = [
  { key: "location", label: "Where", placeholder: "Udaipur, Goa, abroad…", icon: MapPin },
  { key: "tradition", label: "Tradition", placeholder: "Hindu, Sikh, Tamil…", icon: Sparkles },
  { key: "vendor", label: "Looking for", placeholder: "Photographer, decor…", icon: Store },
] as const;

export function GlobalSearch() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2 rounded-[1.75rem] bg-ivory p-2 shadow-[var(--shadow-lg)] sm:flex-row sm:items-center sm:rounded-full sm:gap-0"
      role="search"
      aria-label="Search weddings, vendors and inspiration"
    >
      {SEGMENTS.map((seg, i) => {
        const Icon = seg.icon;
        const isActive = active === seg.key;
        return (
          <div
            key={seg.key}
            className={cn(
              "group flex flex-1 items-center gap-3 rounded-full px-5 py-3 transition-colors duration-[var(--dur-fast)]",
              isActive ? "bg-blush-100" : "hover:bg-cream-deep/60",
              i > 0 && "sm:border-l sm:border-border",
            )}
          >
            <Icon className="h-5 w-5 shrink-0 text-gold-600" aria-hidden />
            <label className="flex flex-1 flex-col">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {seg.label}
              </span>
              <input
                type="text"
                placeholder={seg.placeholder}
                onFocus={() => setActive(seg.key)}
                onBlur={() => setActive(null)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
          </div>
        );
      })}
      <button
        type="submit"
        aria-label="Search"
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-forest-700 px-6 font-medium text-cream transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:bg-forest-600 hover:shadow-[var(--shadow-md)] active:scale-[0.98] sm:ml-2 sm:aspect-square sm:px-0 sm:w-12"
      >
        <Search className="h-5 w-5" aria-hidden />
        <span className="sm:hidden">Search</span>
      </button>
    </form>
  );
}
