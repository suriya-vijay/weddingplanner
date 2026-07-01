import type { Metadata } from "next";
import { Panel } from "@/components/dashboard/ui";
import { weddingProfile } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Settings · Kalyanam & Co.",
};

const FIELDS: { label: string; value: string }[] = [
  { label: "Partner one", value: weddingProfile.partnerA },
  { label: "Partner two", value: weddingProfile.partnerB },
  { label: "Wedding date", value: weddingProfile.date },
  { label: "City", value: weddingProfile.city },
  { label: "Venue", value: weddingProfile.venue },
  { label: "Tradition", value: weddingProfile.tradition },
  { label: "Guest estimate", value: String(weddingProfile.guestEstimate) },
  {
    label: "Total budget",
    value: weddingProfile.currency + weddingProfile.totalBudget.toLocaleString("en-IN"),
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Your wedding</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-soft">
          The core details that power your workspace. Editing arrives with the
          backend.
        </p>
      </header>

      <Panel>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.label} className="border-b border-border/70 pb-4">
              <dt className="text-xs uppercase tracking-wider text-ink-faint">
                {f.label}
              </dt>
              <dd className="mt-1 font-serif text-lg text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
