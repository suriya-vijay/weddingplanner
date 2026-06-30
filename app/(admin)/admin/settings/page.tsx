import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings · Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-soft">
          Workspace and brand settings. Live configuration arrives with the
          backend.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]">
        {[
          ["Brand name", "Kalyanam & Co."],
          ["Tagline", "Where Forever Takes Shape"],
          ["Primary contact", "dba@lca.com"],
          ["Plan", "Founder (preview)"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-border/60 pb-4 last:border-0 last:pb-0"
          >
            <span className="text-sm text-ink-soft">{label}</span>
            <span className="font-medium text-ink">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
