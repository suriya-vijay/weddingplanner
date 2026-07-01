"use client";

import { useSyncExternalStore } from "react";

/** No-op subscribe — the value never changes after mount for our purposes. */
const subscribe = () => () => {};

/**
 * Days-until-wedding counter. Uses useSyncExternalStore so the server renders a
 * stable placeholder ("—") and the client computes the live count on hydration —
 * no setState-in-effect, no hydration mismatch. A single computation, no animation.
 */
export function Countdown({ dateISO }: { dateISO: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => {
      const target = new Date(dateISO + "T00:00:00").getTime();
      return Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
    },
    () => null, // server snapshot
  );

  return <span className="tabular-nums">{days === null ? "—" : days}</span>;
}
