import type { Metadata } from "next";
import { Store } from "lucide-react";
import { popularVendors } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Manage Vendors · Admin" };

export default function AdminVendorsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Vendors</h1>
        <p className="mt-1 text-ink-soft">
          Curate the vendor marketplace. Full management arrives with the
          marketplace milestone.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-[var(--shadow-sm)]">
        <ul className="divide-y divide-border/60">
          {popularVendors.map((v) => (
            <li key={v.name} className="flex items-center gap-3 px-4 py-3">
              <span
                aria-hidden
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{ background: v.plate }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{v.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {v.category} · {v.location}
                </p>
              </div>
              <span className="hidden text-sm text-ink-soft sm:block">
                {v.startingAt}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-ink-soft">
        <Store className="h-4 w-4 text-gold-600" />
        Vendor add/edit, approvals, and portfolios come with the Vendor
        Marketplace build.
      </div>
    </div>
  );
}
