"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { EnquiryThread } from "@/components/enquiry/enquiry-thread";
import { type VendorEnquiry, type EnquiryStatus } from "@/lib/mock-data";
import type { EnquiryMessage } from "@/lib/db/enquiry-chat";
import {
  setEnquiryStatusAction,
  sendVendorMessageAction,
  markVendorEnquiriesSeenAction,
} from "@/app/(vendor)/vendor/actions";

const STATUS_ORDER: EnquiryStatus[] = ["New", "Replied", "Booked", "Closed"];
const STATUS_TONE: Record<EnquiryStatus, string> = {
  New: "bg-gold-100 text-gold-700",
  Replied: "bg-peacock/15 text-peacock",
  Booked: "bg-forest-100 text-forest-700",
  Closed: "bg-cream-deep text-ink-soft",
};

function fmt(iso: string) {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function EnquiriesView({
  initialEnquiries,
  threads,
}: {
  initialEnquiries: VendorEnquiry[];
  threads: Record<string, EnquiryMessage[]>;
}) {
  const [rows, setRows] = useState<VendorEnquiry[]>(initialEnquiries);
  const [filter, setFilter] = useState<EnquiryStatus | "All">("All");
  const [openThread, setOpenThread] = useState<string | null>(null);
  const router = useRouter();

  // Landing here = the vendor has seen their enquiries → clear the badge.
  useEffect(() => {
    markVendorEnquiriesSeenAction().then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = { New: 0, Replied: 0, Booked: 0, Closed: 0 };
    for (const e of rows) c[e.status] += 1;
    return c;
  }, [rows]);

  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((e) => e.status === filter)),
    [rows, filter],
  );

  const cycle = (id: string) => {
    const e = rows.find((r) => r.id === id);
    if (!e) return;
    const next =
      STATUS_ORDER[(STATUS_ORDER.indexOf(e.status) + 1) % STATUS_ORDER.length];
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    setEnquiryStatusAction(id, next).catch(() =>
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: e.status } : r)),
      ),
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Vendor portal</p>
        <h1 className="mt-2 font-serif text-h1 text-ink">Enquiries</h1>
        <p className="mt-1 text-ink-soft">
          Leads from couples who found you on Kalyanam. Click a status to advance
          it.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="New" value={counts.New} icon={<Inbox className="h-[1.1rem] w-[1.1rem]" />} />
        <StatTile label="Replied" value={counts.Replied} />
        <StatTile label="Booked" value={counts.Booked} />
        <StatTile label="Closed" value={counts.Closed} />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {(["All", ...STATUS_ORDER] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-fast)]",
              filter === s
                ? "border-forest-700 bg-forest-700 text-cream"
                : "border-border-strong bg-ivory text-ink-soft hover:border-gold-400 hover:text-forest-700",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((e) => (
          <Panel key={e.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-serif text-lg text-ink">{e.couple}</h2>
                  <span className="text-xs text-ink-faint">
                    Enquired {fmt(e.date)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {e.functions} · {e.city} · event {fmt(e.eventDate)} · {e.budget}
                </p>
                <p className="mt-2 text-sm text-ink-soft">“{e.message}”</p>
              </div>
              <button
                type="button"
                onClick={() => cycle(e.id)}
                title="Click to advance status"
                className={cn(
                  "shrink-0 self-start rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  STATUS_TONE[e.status],
                )}
              >
                {e.status}
              </button>
            </div>

            <div className="mt-3 border-t border-border/60 pt-3">
              <button
                type="button"
                onClick={() =>
                  setOpenThread(openThread === e.id ? null : e.id)
                }
                className="text-sm font-medium text-forest-700 hover:text-gold-600"
              >
                {openThread === e.id ? "Hide conversation" : "Reply / conversation"}
              </button>
              {openThread === e.id && (
                <div className="mt-3">
                  <EnquiryThread
                    me="vendor"
                    initialMessages={threads[e.id] ?? []}
                    onSend={(body) => sendVendorMessageAction(e.id, body)}
                  />
                </div>
              )}
            </div>
          </Panel>
        ))}
        {/* True-zero reads differently from filtered-zero: a brand-new vendor
            used to be told "No enquiries in this status" under the All tab. */}
        {rows.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No enquiries yet"
          >
            When a couple sends you an enquiry from the marketplace it lands
            here, and you can reply in the same thread.
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Nothing in this status"
          >
            Try another tab, or choose &ldquo;All&rdquo; to see every enquiry.
          </EmptyState>
        ) : null}
      </div>
    </div>
  );
}
