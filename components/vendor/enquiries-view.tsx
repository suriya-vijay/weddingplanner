"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import {
  vendorEnquiries as seed,
  type VendorEnquiry,
  type EnquiryStatus,
} from "@/lib/mock-data";

const STATUS_ORDER: EnquiryStatus[] = ["New", "Replied", "Booked", "Closed"];
const STATUS_TONE: Record<EnquiryStatus, string> = {
  New: "bg-gold-100 text-gold-700",
  Replied: "bg-peacock/15 text-peacock",
  Booked: "bg-forest-100 text-forest-700",
  Closed: "bg-cream-deep text-ink-soft",
};

function fmt(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function EnquiriesView() {
  const [rows, setRows] = useState<VendorEnquiry[]>(seed);
  const [filter, setFilter] = useState<EnquiryStatus | "All">("All");

  const counts = useMemo(() => {
    const c = { New: 0, Replied: 0, Booked: 0, Closed: 0 };
    for (const e of rows) c[e.status] += 1;
    return c;
  }, [rows]);

  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((e) => e.status === filter)),
    [rows, filter],
  );

  const cycle = (id: string) =>
    setRows((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next =
          STATUS_ORDER[(STATUS_ORDER.indexOf(e.status) + 1) % STATUS_ORDER.length];
        return { ...e, status: next };
      }),
    );

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Vendor portal</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Enquiries</h1>
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
          </Panel>
        ))}
        {visible.length === 0 && (
          <Panel>
            <p className="text-center text-sm text-ink-soft">
              No enquiries in this status.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
