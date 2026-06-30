import { cn } from "@/lib/utils";

/** Small label/tag — gold-tinted by default, used for vendor tags & ratings. */
export function Badge({
  children,
  className,
  tone = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "forest" | "blush" | "outline";
}) {
  const tones = {
    gold: "bg-gold-100 text-gold-700",
    forest: "bg-forest-100 text-forest-700",
    blush: "bg-blush-100 text-blush-600",
    outline: "border border-border-strong text-ink-soft",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
