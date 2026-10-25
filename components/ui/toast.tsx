"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Minimal app-wide toast. Optimistic UIs roll back silently when a save fails,
 * which reads as "my change just vanished" — `notifyError()` tells the user
 * why. Event-based so any client component can call it without a provider.
 */

type Toast = { id: number; message: string };

const EVENT = "kalyanam:toast";
let seq = 0;

export function notifyError(
  message = "We couldn’t save that change. Please check your connection and try again.",
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Toast>(EVENT, { detail: { id: ++seq, message } }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    function onToast(e: Event) {
      const t = (e as CustomEvent<Toast>).detail;
      // Collapse repeats of the same message (e.g. several failed rows).
      setToasts((cur) => (cur.some((x) => x.message === t.message) ? cur : [...cur, t]));
      const timer = setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== t.id));
        timers.delete(timer);
      }, 6000);
      timers.add(timer);
    }
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!toasts.length) return null;
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-maroon/15 bg-blush-100 px-4 py-3 text-sm text-maroon shadow-lg"
        >
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
            className="-m-1 rounded p-1 opacity-70 hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
