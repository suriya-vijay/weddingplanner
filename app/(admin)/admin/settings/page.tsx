import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/get-session";
import { getVendorsForAdmin } from "@/lib/db/vendors";
import { getInspiration } from "@/lib/db/inspiration";

export const metadata: Metadata = { title: "Settings · Admin" };

/**
 * Admin settings — read-only workspace facts.
 *
 * This page used to show a hardcoded table ("Primary contact dba@lca.com",
 * "Plan: Founder (preview)") under the line "Live configuration arrives with
 * the backend" — which stopped being true once the backend shipped. Everything
 * here is now either a real brand constant or read from live data.
 */
export default async function AdminSettingsPage() {
  const [user, vendors, inspiration] = await Promise.all([
    getSessionUser(),
    getVendorsForAdmin(),
    getInspiration(),
  ]);

  const pending = vendors.filter((v) => v.status === "pending").length;

  const rows: [string, string][] = [
    ["Brand name", "Kalyanam & Co."],
    ["Tagline", "Where Forever Takes Shape"],
    ["Signed in as", user?.name ?? "—"],
    ["Role", user?.role ?? "—"],
    ["Vendors", `${vendors.length} total · ${pending} awaiting review`],
    ["Inspiration items", String(inspiration.length)],
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-serif text-h1 text-ink">Settings</h1>
        <p className="mt-1 text-ink-soft">
          Your workspace at a glance. Vendors and inspiration are managed from
          their own pages.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-border/60 pb-4 last:border-0 last:pb-0"
          >
            <span className="text-sm text-ink-soft">{label}</span>
            <span className="text-right font-medium capitalize text-ink">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
