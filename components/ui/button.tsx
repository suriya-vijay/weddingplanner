"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kalyanam button — fully re-skinned (no default shadcn look).
 * Implements UX Bible §1: hover lift, press scale(0.98), gold focus ring,
 * disabled + loading states.
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium tracking-tight " +
    "transition-[transform,box-shadow,background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-soft)] " +
    "cursor-pointer select-none active:scale-[0.98] " +
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold-500 " +
    "disabled:pointer-events-none disabled:opacity-45 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-500 text-forest-900 shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-[var(--shadow-gold)]",
        forest:
          "bg-forest-700 text-cream shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-forest-600 hover:shadow-[var(--shadow-md)]",
        outline:
          "border border-forest-700/30 bg-transparent text-forest-700 hover:border-forest-700 hover:bg-forest-700 hover:text-cream",
        ghost:
          "bg-transparent text-forest-700 hover:bg-forest-700/[0.06]",
        link: "bg-transparent px-0 text-forest-700 underline-offset-4 hover:text-gold-600 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-[3.25rem] px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant, size, className, children, loading } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (props.href !== undefined) {
    const { href, ...rest } = props;
    const anchorProps = stripStyleProps(rest);
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { disabled, ...rest } = props;
  const buttonProps = stripStyleProps(rest);
  return (
    <button className={classes} disabled={disabled || loading} {...buttonProps}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      <span className={cn(loading && "opacity-80")}>{children}</span>
    </button>
  );
}

/** Remove style-only props so they aren't spread onto the DOM element. */
function stripStyleProps<T extends Record<string, unknown>>(props: T) {
  const { variant, size, loading, className, children, ...domProps } = props;
  void variant;
  void size;
  void loading;
  void className;
  void children;
  return domProps;
}
