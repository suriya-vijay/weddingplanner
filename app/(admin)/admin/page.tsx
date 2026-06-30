import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Store, Heart, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  inspirationItems,
  popularVendors,
  vendorCategories,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Admin · Kalyanam & Co.",
};

const STATS = [
  {
    label: "Inspirations",
    value: inspirationItems.length,
    icon: Sparkles,
    sub: "live in the gallery",
  },
  {
    label: "Vendors",
    value: popularVendors.length,
    icon: Store,
    sub: `${vendorCategories.length} categories`,
  },
  { label: "Total saves", value: 1284, icon: Heart, sub: "this month" },
  { label: "Visits", value: "18.2k", icon: TrendingUp, sub: "last 30 days" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Dashboard</h1>
        <p className="mt-1 text-ink-soft">
          Welcome back — here’s how Kalyanam is looking today.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">{s.label}</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </span>
              </div>
              <p className="mt-3 font-serif text-3xl text-ink">{s.value}</p>
              <p className="mt-1 text-xs text-ink-faint">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent inspiration */}
      <section className="rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]">
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
              className="flex items-center gap-3 rounded-xl border border-border/70 p-2.5"
            >
              <span
                aria-hidden
                className="h-12 w-12 shrink-0 rounded-lg"
                style={{ background: item.plate }}
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
      </section>
    </div>
  );
}
