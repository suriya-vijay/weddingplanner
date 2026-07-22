import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllEnquiries } from "@/lib/db/admin-enquiries";

export const metadata: Metadata = { title: "Enquiries · Admin" };

/**
 * Read-only moderation view of every couple↔vendor conversation.
 *
 * `enq_admin` / `enq_msg_admin` already granted admins this access — the
 * permission existed and the screen never did, so an abuse report had nowhere
 * to be actioned.
 */
export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiries();
  const withReplies = enquiries.filter((e) => e.messages.length > 0).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Enquiries
        </h1>
        <p className="mt-1 text-ink-soft">
          Every couple↔vendor conversation, for moderation. Read-only.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile label="Enquiries" value={enquiries.length} sub="all time" />
        <StatTile
          label="With replies"
          value={withReplies}
          sub="conversations started"
        />
      </div>

      {enquiries.length === 0 ? (
        <EmptyState icon={<Inbox className="h-6 w-6" />} title="No enquiries yet">
          When couples reach out to vendors, those conversations appear here.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <Panel key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-serif text-lg text-ink">
                  {e.couple} <span className="text-ink-faint">→</span>{" "}
                  {e.vendorName}
                </h2>
                <span className="text-xs text-ink-faint">
                  {new Date(e.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {e.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {[e.functions, e.city, e.budget].filter(Boolean).join(" · ")}
              </p>
              {e.message && (
                <p className="mt-2 text-sm text-ink-soft">“{e.message}”</p>
              )}

              {e.messages.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
                  {e.messages.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-border/70 px-3 py-2 text-sm"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider text-gold-600">
                        {m.sender}
                      </span>
                      <p className="mt-1 text-ink-soft">{m.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
