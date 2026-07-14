"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Trash2, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { VendorProfile } from "@/lib/mock-data";
import {
  setVendorStatusAction,
  deleteVendorAction,
} from "@/app/(admin)/admin/actions";

type AdminVendor = VendorProfile & {
  id: string;
  status: string;
  rejectionReason: string;
};

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
  const [rejecting, setRejecting] = useState<AdminVendor | null>(null);

  const ordered = useMemo(() => {
    const rank: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };
    return [...vendors].sort(
      (a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3),
    );
  }, [vendors]);

  function setStatus(v: AdminVendor, status: "approved" | "rejected", reason = "") {
    const prev = v.status;
    const prevReason = v.rejectionReason;
    setVendors((cur) =>
      cur.map((x) =>
        x.id === v.id
          ? {
              ...x,
              status,
              rejectionReason: status === "rejected" ? reason : "",
              verified: status === "approved" ? true : x.verified,
            }
          : x,
      ),
    );
    setVendorStatusAction(v.id, status, reason).then((res) => {
      if (!res.ok)
        setVendors((cur) =>
          cur.map((x) =>
            x.id === v.id
              ? { ...x, status: prev, rejectionReason: prevReason }
              : x,
          ),
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
                {v.status === "rejected" && v.rejectionReason && (
                  <p className="truncate text-xs text-maroon">
                    Reason: {v.rejectionReason}
                  </p>
                )}
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
                  onClick={() => setRejecting(v)}
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

      {rejecting && (
        <RejectDialog
          vendor={rejecting}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => {
            setStatus(rejecting, "rejected", reason);
            setRejecting(null);
          }}
        />
      )}
    </div>
  );
}

function RejectDialog({
  vendor,
  onClose,
  onConfirm,
}: {
  vendor: AdminVendor;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState(vendor.rejectionReason ?? "");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Reject {vendor.name}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          The vendor will see this reason in their portal so they can fix it and
          resubmit.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(reason.trim());
          }}
          className="mt-5 space-y-4"
        >
          <Field label="Reason for rejection">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              autoFocus
              placeholder="e.g. The cover photo is low quality and the about section is empty."
              className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
            />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Reject vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
