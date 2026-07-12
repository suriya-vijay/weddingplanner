"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Free-text combobox with suggestions from a bundled list. Not restricted to
 * the list — any typed value is kept (onChange fires on every keystroke). Used
 * for location inputs. Keyboard: ↑/↓ to move, Enter to pick, Esc to close.
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  className,
  id,
  max = 8,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  id?: string;
  max?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const q = value.trim().toLowerCase();
  const matches = q
    ? options.filter((o) => o.toLowerCase().includes(q)).slice(0, max)
    : [];

  // Close when clicking outside.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
  }

  const showList = open && matches.length > 0;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % matches.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + matches.length) % matches.length);
          } else if (e.key === "Enter") {
            e.preventDefault();
            pick(matches[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink placeholder:text-ink-faint transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border-strong bg-ivory py-1 shadow-[var(--shadow-md)]"
        >
          {matches.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(o);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm",
                i === active
                  ? "bg-forest-100 text-forest-800"
                  : "text-ink hover:bg-cream-deep",
              )}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
