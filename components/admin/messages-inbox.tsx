"use client";

import { useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/lib/db/contact";
import { setContactHandledAction } from "@/app/(admin)/admin/actions";

/** Contact-form inbox. Optimistic handled/unhandled toggle, reverts on error. */
export function MessagesInbox({
  initial,
}: {
  initial: ContactSubmission[];
}) {
  const [rows, setRows] = useState(initial);
  const [showHandled, setShowHandled] = useState(false);

  const visible = showHandled ? rows : rows.filter((r) => !r.handled);
  const open = rows.filter((r) => !r.handled).length;

  function toggle(id: string, handled: boolean) {
    const snapshot = rows;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, handled } : r)),
    );
    setContactHandledAction(id, handled).then((res) => {
      if (!res.ok) setRows(snapshot);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {open} awaiting a reply
          {rows.length - open > 0 && ` · ${rows.length - open} handled`}
        </p>
        <button
          type="button"
          onClick={() => setShowHandled((v) => !v)}
          className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-ink-soft transition-colors duration-[var(--dur-fast)] hover:border-gold-400 hover:text-forest-700"
        >
          {showHandled ? "Hide handled" : "Show handled"}
        </button>
      </div>

      {visible.map((m) => (
        <Panel key={m.id} className={cn(m.handled && "opacity-60")}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-serif text-lg text-ink">{m.name}</h2>
            <span className="text-xs text-ink-faint">
              {new Date(m.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            <a
              href={`mailto:${m.email}`}
              className="font-medium text-forest-700 hover:text-gold-600"
            >
              {m.email}
            </a>
            {m.interest && <> · {m.interest}</>}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-ink">
            {m.message}
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              href={`mailto:${m.email}?subject=Re: your message to Kalyanam`}
              variant="outline"
              size="sm"
            >
              Reply by email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggle(m.id, !m.handled)}
            >
              {m.handled ? (
                <>
                  <Undo2 className="h-4 w-4" /> Mark unhandled
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Mark handled
                </>
              )}
            </Button>
          </div>
        </Panel>
      ))}
    </div>
  );
}
