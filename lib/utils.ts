import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** US-dollar formatter, e.g. 1800000 → "$1,800,000". */
export function formatUSD(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

/** @deprecated use formatUSD — kept as an alias to avoid churn. */
export const formatINR = formatUSD;

/**
 * Chronological comparator for timeline milestones: earliest date first,
 * undated last, `sort` as the tiebreak (so same-date/undated items keep their
 * manual order). Client-safe — the view sorts optimistically with this after an
 * add or a date edit, and the DB read applies the same order.
 */
export function byDateThenSort<T extends { date: string; sort?: number }>(
  a: T,
  b: T,
): number {
  if (a.date && b.date && a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.date && !b.date) return -1; // dated before undated
  if (!a.date && b.date) return 1;
  return (a.sort ?? 0) - (b.sort ?? 0);
}

/** Whole days from `today` (server-stable if you pass a fixed reference). */
export function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(fromISO + "T00:00:00Z").getTime();
  const to = new Date(toISO + "T00:00:00Z").getTime();
  return Math.round((to - from) / 86_400_000);
}
