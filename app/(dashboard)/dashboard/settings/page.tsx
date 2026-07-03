import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getOrCreateWedding } from "@/lib/db/weddings";

export const metadata: Metadata = {
  title: "Settings · Kalyanam & Co.",
};

export default async function SettingsPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Your wedding</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-soft">
          The core details that power your workspace — your date drives the
          countdown, your budget drives the tracker.
        </p>
      </header>

      <SettingsForm wedding={wedding} />
    </div>
  );
}
