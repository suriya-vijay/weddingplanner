"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Store,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { LotusMark } from "@/components/brand/motifs";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inspiration", href: "/admin/inspiration", icon: Sparkles },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/** Admin sidebar — its own chrome (no public header/footer). */
export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-cream/10 bg-forest-900 px-4 py-4 text-cream lg:h-dvh lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <div className="mb-2 flex items-center gap-2.5 px-2 lg:mb-6">
        <LotusMark className="h-7 w-7 text-gold-400" />
        <div className="leading-tight">
          <p className="font-serif text-lg">Kalyanam</p>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-400">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex gap-1 lg:flex-col">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--dur-fast)]",
                isActive
                  ? "bg-cream/10 text-cream"
                  : "text-cream/65 hover:bg-cream/[0.06] hover:text-cream",
              )}
            >
              <Icon className="h-[1.15rem] w-[1.15rem]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-auto hidden items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-cream/55 transition-colors hover:text-cream lg:flex"
      >
        <ArrowLeft className="h-4 w-4" /> Back to site
      </Link>
    </aside>
  );
}
