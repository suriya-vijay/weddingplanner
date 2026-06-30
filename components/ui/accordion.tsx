"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = { question: string; answer: string };

/**
 * FAQ accordion — re-skinned, accessible (button + aria-expanded + region).
 * Smooth height/opacity reveal per UX Bible §0 (transform/opacity, gold accent).
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-1">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-serif text-lg text-ink transition-colors duration-[var(--dur-fast)] group-hover:text-forest-700 sm:text-xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-200 text-gold-600 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)]",
                    isOpen && "rotate-45 bg-gold-500 text-forest-900",
                  )}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              className={cn(
                "grid transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)]",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pr-12 text-ink-soft">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
