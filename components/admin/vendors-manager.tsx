"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Trash2, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VendorProfile } from "@/lib/mock-data";
import {
  setVendorStatusAction,
  deleteVendorAction,
} from "@/app/(admin)/admin/actions";

type AdminVendor = VendorProfile & { id: string; status: string };

const STATUS_TONE: Record<string, string> = {
  pending: "bg-gold-100 text-gold-700",
  approved: "bg-forest-100 text-forest-700",
  rejected: "bg-cream-deep text-ink-soft",
};

/**
 * Admin vendor management: approve / reject vendors for the public marketplace
 * (status gate) and hard-delete inappropriate ones. Optimistic; reverts on
 * failure. RLS `vendors_admin` gates the writes. Pending shown first.
 */
export function VendorsManager({
  initialVendors,
}: {
  initialVendors: AdminVendor[];
}) {
  const [vendors, setVendors] = useState<AdminVendor[]>(initialVendors);

  const ordered = useMemo(() => {
    const rank: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };
    return [...vendors].sort(
      (a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3),
    );
  }, [vendors]);

  function setStatus(v: AdminVendor, status: "approved" | "rejected") {
    const prev = v.status;
    setVendors((cur) =>
      cur.map((x) =>
        x.id === v.id
          ? { ...x, status, verified: status === "approved" ? true : x.verified }
          : x,
      ),
    );
    setVendorStatusAction(v.id, status).then((res) => {
      if (!res.ok)
        setVendors((cur) =>
          cur.map((x) => (x.id === v.id ? { ...x, status: prev } : x)),
        );
    });
  }

  function remove(v: AdminVendor) {
    if (
      !confirm(
        `Delete "${v.name}"? This permanently removes the vendor.`,
      )
    )
      return;
    const snapshot = vendors;
    setVendors((cur) => cur.filter((x) => x.id !== v.id));
    deleteVendorAction(v.id).then((res) => {
      if (!res.ok) setVendors(snapshot);
    });
  }

  const pending = vendors.filter((v) => v.status === "pending").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Vendors</h1>
        <p className="mt-1 text-ink-soft">
          {vendors.length} vendors · {pending} awaiting review. Approve to
          publish on the marketplace, reject to hide, or delete inappropriate
          listings.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-[var(--shadow-sm)]">
        <ul className="divide-y divide-border/60">
          {ordered.map((v) => (
            <li key={v.id} className="flex items-center gap-3 px-4 py-3">
              <span
                aria-hidden
                className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                style={{ background: v.logoPlate }}
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate font-medium text-ink">
                  {v.name}
                  {v.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-forest-600" />
                  )}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {v.category || "—"} · {v.location || "—"}
                </p>
              </div>

              <span
                className={cn(
                  "hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:inline-flex",
                  STATUS_TONE[v.status] ?? "bg-cream-deep text-ink-soft",
                )}
              >
                {v.status === "pending" && <Clock className="h-3 w-3" />}
                {v.status}
              </span>

              {v.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => setStatus(v, "approved")}
                  className="hidden shrink-0 items-center gap-1 rounded-full bg-forest-100 px-3 py-1.5 text-xs font-medium text-forest-700 transition-colors hover:bg-forest-200 sm:inline-flex"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              )}
              {v.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => setStatus(v, "rejected")}
                  aria-label={`Reject ${v.name}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-gold-100 hover:text-gold-700"
                  title="Reject (hide from marketplace)"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label={`Delete ${v.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-destructive/10 hover:text-destructive"
                title="Delete permanently"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {vendors.length === 0 && (
            <li className="px-4 py-10 text-center text-ink-soft">
              No vendors yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
