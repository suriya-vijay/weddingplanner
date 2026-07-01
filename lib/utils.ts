import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Compact Indian-rupee formatter, e.g. 1800000 → "₹18,00,000". */
export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/** Whole days from `today` (server-stable if you pass a fixed reference). */
export function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(fromISO + "T00:00:00Z").getTime();
  const to = new Date(toISO + "T00:00:00Z").getTime();
  return Math.round((to - from) / 86_400_000);
}
