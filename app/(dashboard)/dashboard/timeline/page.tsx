import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { timelineMilestones, weddingProfile } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Timeline · Kalyanam & Co.",
};

function fmt(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TimelinePage() {
  const doneCount = timelineMilestones.filter((m) => m.status === "done").length;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Planning</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Timeline</h1>
        <p className="mt-1 text-ink-soft">
          {doneCount} of {timelineMilestones.length} milestones complete on the
          road to {fmt(weddingProfile.date)}.
        </p>
      </header>

      <Panel>
        <ol className="relative ml-3 border-l border-border-strong">
          {timelineMilestones.map((m) => {
            const done = m.status === "done";
            return (
              <li key={m.id} className="relative ml-8 pb-8 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[2.85rem] grid h-7 w-7 place-items-center rounded-full border-2",
                    done
                      ? "border-forest-600 bg-forest-600 text-cream"
                      : "border-gold-400 bg-cream text-gold-600",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </span>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2
                    className={cn(
                      "font-serif text-lg",
                      done ? "text-ink" : "text-ink",
                    )}
                  >
                    {m.title}
                  </h2>
                  <span
                    className={cn(
                      "shrink-0 text-sm",
                      done ? "text-ink-faint" : "font-medium text-gold-600",
                    )}
                  >
                    {fmt(m.date)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{m.detail}</p>
                {!done && (
                  <span className="mt-2 inline-block rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">
                    Upcoming
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}
