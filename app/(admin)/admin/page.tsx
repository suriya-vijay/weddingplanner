import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Store, Heart, TrendingUp, ArrowUpRight } from "lucide-react";
import { Plate } from "@/components/ui/plate";
import { StatTile } from "@/components/dashboard/ui";
import { getInspiration } from "@/lib/db/inspiration";
import { getVendors } from "@/lib/db/vendors";
import { getAdminStats } from "@/lib/db/admin-stats";
import { Stagger } from "@/components/ui/stagger";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Admin · Kalyanam & Co.",
};

export default async function AdminDashboard() {
  const [inspirationItems, vendors, stats] = await Promise.all([
    getInspiration(),
    getVendors(),
    getAdminStats(),
  ]);
  const categories = new Set(vendors.map((v) => v.category)).size;

  // Every tile is a real query — no placeholder figures.
  const STATS = [
    {
      label: "Inspirations",
      value: inspirationItems.length,
      icon: Sparkles,
      sub: "live in the gallery",
    },
    {
      label: "Vendors",
      value: vendors.length,
      icon: Store,
      sub: `${categories} categories`,
    },
    {
      label: "Total saves",
      value: stats.totalSaves.toLocaleString("en-US"),
      icon: Heart,
      sub: "to couples’ mood boards",
    },
    {
      label: "Profile views",
      value: stats.profileViews.toLocaleString("en-US"),
      icon: TrendingUp,
      sub: "across all vendors",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-h1 text-ink">Dashboard</h1>
        <p className="mt-1 text-ink-soft">
          Welcome back — here’s how Kalyanam is looking today.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stagger>
          {STATS.map((s) => {
            const Icon = s.icon;
            // Use the shared StatTile (was reimplemented inline here, so it
            // silently missed the hover + tabular-nums added in 4a).
            return (
              <StatTile
                key={s.label}
                label={s.label}
                value={s.value}
                sub={s.sub}
                icon={<Icon className="h-[1.1rem] w-[1.1rem]" />}
              />
            );
          })}
        </Stagger>
      </div>

      {/* Recent inspiration */}
      <Reveal delay={60} as="section" className="rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">Recent inspiration</h2>
          <Link
            href="/admin/inspiration"
            className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
          >
            Manage all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inspirationItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border/70 p-2.5 transition-[border-color,box-shadow] duration-[var(--dur-fast)] hover:border-gold-200 hover:shadow-[var(--shadow-xs)]"
            >
              <Plate
                imageUrl={item.imageUrl}
                fallback={item.plate}
                alt={item.title}
                className="h-12 w-12 shrink-0 rounded-lg"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {item.title}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {item.tradition} · {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
