"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ChevronDown, ExternalLink } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { EnquiryThread } from "@/components/enquiry/enquiry-thread";
import type { CoupleEnquiry, EnquiryMessage } from "@/lib/db/enquiry-chat";
import { sendCoupleMessageAction } from "@/app/(dashboard)/dashboard/actions";

const STATUS_TONE: Record<string, string> = {
  New: "bg-gold-100 text-gold-700",
  Replied: "bg-peacock/15 text-peacock",
  Booked: "bg-forest-100 text-forest-700",
  Closed: "bg-cream-deep text-ink-soft",
};

export function CoupleEnquiries({
  enquiries,
  threads,
}: {
  enquiries: CoupleEnquiry[];
  threads: Record<string, EnquiryMessage[]>;
}) {
  const [open, setOpen] = useState<string | null>(
    enquiries.length ? enquiries[0].id : null,
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Messages</h1>
        <p className="mt-1 text-ink-soft">
          Your enquiries to vendors — chat to work out details, pricing and
          dates.
        </p>
      </header>

      {enquiries.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
              <MessageCircle className="h-6 w-6" />
            </span>
            <p className="max-w-sm text-ink-soft">
              You haven&apos;t enquired with any vendors yet. Browse the{" "}
              <Link href="/vendors" className="font-medium text-forest-700 hover:text-gold-600">
                marketplace
              </Link>{" "}
              and hit “Enquire now” to start a conversation.
            </p>
          </div>
        </Panel>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => {
            const isOpen = open === e.id;
            return (
              <Panel key={e.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="font-serif text-lg text-ink">
                        {e.vendorName}
                      </h2>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          STATUS_TONE[e.status] ?? "bg-cream-deep text-ink-soft",
                        )}
                      >
                        {e.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-ink-soft">
                      {[e.functions, e.city, e.budget].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-ink-soft transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-3">
                    {e.vendorSlug && (
                      <Link
                        href={`/vendors/${e.vendorSlug}`}
                        className="inline-flex items-center gap-1 text-sm text-forest-700 hover:text-gold-600"
                      >
                        View vendor <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <EnquiryThread
                      me="couple"
                      initialMessages={threads[e.id] ?? []}
                      onSend={(body) => sendCoupleMessageAction(e.id, body)}
                    />
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
