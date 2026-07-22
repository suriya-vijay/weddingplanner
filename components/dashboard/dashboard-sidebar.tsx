"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Wallet,
  CalendarClock,
  Users,
  LayoutGrid,
  MessageCircle,
  Sparkles,
  Settings,
} from "lucide-react";
import { LotusMark } from "@/components/brand/motifs";
import { SidebarAccount } from "@/components/layout/sidebar-account";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Checklist", href: "/dashboard/checklist", icon: ListChecks },
  { label: "Budget", href: "/dashboard/budget", icon: Wallet },
  { label: "Timeline", href: "/dashboard/timeline", icon: CalendarClock },
  { label: "Guests", href: "/dashboard/guests", icon: Users },
  { label: "Seating", href: "/dashboard/seating", icon: LayoutGrid },
  { label: "Messages", href: "/dashboard/enquiries", icon: MessageCircle },
  { label: "AI Advisor", href: "/dashboard/advisor", icon: Sparkles },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

/** Couple's dashboard sidebar — its own chrome (no public header/footer). */
export function DashboardSidebar({
  unreadEnquiries = 0,
}: {
  unreadEnquiries?: number;
}) {
  const pathname = usePathname();
  return (
    // texture-paisley = a static tiled SVG (rasterized once, ~zero runtime
    // cost) so the workspace carries the same Indian luxury feel as the
    // marketing pages. No animation, no blur.
    // The rail stretches to the FULL page height (lg:self-stretch) so the green
    // never stops partway down on a tall page; the inner wrapper is what
    // sticks, keeping the nav in view while scrolling.
    <aside className="texture-paisley on-dark relative flex w-full shrink-0 flex-col border-b border-cream/10 bg-forest-900 px-4 py-4 text-cream lg:w-64 lg:self-stretch lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <div className="flex flex-col gap-1 lg:sticky lg:top-7 lg:min-h-[calc(100dvh-3.5rem)]">
      <div className="mb-2 flex items-center gap-2.5 px-2 lg:mb-6">
        <LotusMark className="h-7 w-7 text-gold-400" />
        <div className="leading-tight">
          <p className="font-serif text-lg">Kalyanam</p>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-400">
            Your Wedding
          </p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--dur-fast)]",
                isActive
                  ? "bg-cream/10 text-cream"
                  : "text-cream/65 hover:bg-cream/[0.06] hover:text-cream",
              )}
            >
              <Icon className="h-[1.15rem] w-[1.15rem]" />
              <span>{item.label}</span>
              {item.href === "/dashboard/enquiries" && unreadEnquiries > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1.5 text-xs font-semibold text-forest-900">
                  {unreadEnquiries > 9 ? "9+" : unreadEnquiries}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

        <SidebarAccount />
      </div>
    </aside>
  );
}
