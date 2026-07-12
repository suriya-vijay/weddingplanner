"use client";

import { useState } from "react";
import { BadgeCheck, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VendorProfile } from "@/lib/mock-data";
import {
  setVendorVerifiedAction,
  deleteVendorAction,
} from "@/app/(admin)/admin/actions";

type AdminVendor = VendorProfile & { id: string };

/**
 * Admin vendor management: approve (verify) vendors and remove inappropriate
 * ones. Optimistic; reverts on failure. RLS `vendors_admin` gates the writes.
 */
export function VendorsManager({
  initialVendors,
}: {
  initialVendors: AdminVendor[];
}) {
  const [vendors, setVendors] = useState<AdminVendor[]>(initialVendors);

  function toggleVerified(v: AdminVendor) {
    const next = !v.verified;
    setVendors((prev) =>
      prev.map((x) => (x.id === v.id ? { ...x, verified: next } : x)),
    );
    setVendorVerifiedAction(v.id, next).then((res) => {
      if (!res.ok)
        setVendors((prev) =>
          prev.map((x) =>
            x.id === v.id ? { ...x, verified: v.verified } : x,
          ),
        );
    });
  }

  function remove(v: AdminVendor) {
    if (
      !confirm(
        `Delete "${v.name}"? This removes the vendor from the marketplace.`,
      )
    )
      return;
    const snapshot = vendors;
    setVendors((prev) => prev.filter((x) => x.id !== v.id));
    deleteVendorAction(v.id).then((res) => {
      if (!res.ok) setVendors(snapshot);
    });
  }

  const pending = vendors.filter((v) => !v.verified).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Vendors</h1>
        <p className="mt-1 text-ink-soft">
          {vendors.length} vendors · {pending} awaiting approval. Approve to
          publish as verified, or remove inappropriate listings.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-[var(--shadow-sm)]">
        <ul className="divide-y divide-border/60">
          {vendors.map((v) => (
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
              <button
                type="button"
                onClick={() => toggleVerified(v)}
                className={cn(
                  "hidden shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:inline-flex",
                  v.verified
                    ? "bg-forest-100 text-forest-700 hover:bg-forest-200"
                    : "bg-gold-100 text-gold-700 hover:bg-gold-200",
                )}
              >
                {v.verified ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Verified
                  </>
                ) : (
                  "Approve"
                )}
              </button>
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label={`Delete ${v.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-destructive/10 hover:text-destructive"
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
