import Link from "next/link";
import { cn } from "@/lib/utils";
import { LotusMark } from "./motifs";

/**
 * Kalyanam & Co. wordmark + lotus mark.
 * `tone` controls color so it reads on the transparent hero (cream) and
 * the solid scrolled header (ink).
 */
export function Logo({
  className,
  tone = "ink",
  href = "/",
}: {
  className?: string;
  tone?: "ink" | "cream";
  href?: string;
}) {
  const text = tone === "cream" ? "text-cream" : "text-ink";
  const mark = tone === "cream" ? "text-gold-400" : "text-gold-600";

  return (
    <Link
      href={href}
      aria-label="Kalyanam & Co. — home"
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity duration-[var(--dur-fast)] hover:opacity-90",
        className,
      )}
    >
      <LotusMark
        className={cn(
          "h-7 w-7 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:rotate-[8deg]",
          mark,
        )}
      />
      <span className={cn("flex flex-col leading-none", text)}>
        <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
          Kalyanam <span className={mark}>&amp;</span> Co.
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.58rem] font-medium uppercase tracking-[0.28em]",
            tone === "cream" ? "text-cream/70" : "text-ink-soft",
          )}
        >
          Where Forever Takes Shape
        </span>
      </span>
    </Link>
  );
}
