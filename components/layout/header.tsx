"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Inspiration", href: "#inspiration" },
  { label: "Vendors", href: "#vendors" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

/**
 * Scroll-aware header (UX Bible §4, §7).
 * Transparent over hero → solidifies (cream + hairline + shadow) past 64px.
 * Mobile slide-in panel with scrim + focus handling.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)]",
        solid
          ? "border-b border-border bg-cream/85 py-3 shadow-[var(--shadow-sm)] backdrop-blur-md"
          : "border-b border-transparent py-5",
      )}
    >
      <div className="container-luxe flex items-center justify-between">
        <Logo tone={solid ? "ink" : "cream"} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative text-[0.95rem] font-medium transition-colors duration-[var(--dur-fast)]",
                solid
                  ? "text-ink-soft hover:text-forest-700"
                  : "text-cream/85 hover:text-cream",
              )}
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href="/login"
            variant="ghost"
            size="sm"
            className={cn(!solid && "text-cream hover:bg-cream/10")}
          >
            Log In
          </Button>
          <Button href="/signup" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden",
            solid ? "text-forest-700" : "text-cream",
          )}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile panel + scrim */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-[-1] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-forest-900/45 transition-opacity duration-[var(--dur-base)]",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <nav
          className={cn(
            "absolute right-0 top-0 flex h-dvh w-[78%] max-w-sm flex-col gap-1 bg-cream px-7 pb-8 pt-24 shadow-[var(--shadow-lg)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border py-4 font-serif text-xl text-ink transition-colors hover:text-forest-700"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/login" variant="outline" size="md">
              Log In
            </Button>
            <Button href="/signup" variant="primary" size="md">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
