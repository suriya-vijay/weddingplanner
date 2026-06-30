import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Kalyanam input — re-skinned (no default shadcn look). Pill-ish, warm border,
 * gold focus ring. Server-safe (no client hooks).
 */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink",
        "placeholder:text-ink-faint",
        "transition-colors duration-[var(--dur-fast)]",
        "focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
