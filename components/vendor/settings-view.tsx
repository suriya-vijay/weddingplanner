"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VendorProfile } from "@/lib/mock-data";
import { updateVendorProfileAction } from "@/app/(vendor)/vendor/actions";

const PRICE_TIERS = ["$", "$$", "$$$", "$$$$"];

/**
 * Vendor Settings — the "business terms" (price tier, starting price,
 * availability) that the Profile page doesn't cover. Saves live. The story +
 * photos + styles live on My Profile.
 */
export function VendorSettingsView({ vendor }: { vendor: VendorProfile }) {
  const [priceTier, setPriceTier] = useState(vendor.priceTier);
  const [startingAt, setStartingAt] = useState(vendor.startingAt);
  const [availability, setAvailability] = useState(vendor.availability);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectClass =
    "h-12 w-full rounded-xl border border-border-strong bg-ivory px-3 text-[0.95rem] text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500";

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await updateVendorProfileAction({
      price_tier: priceTier,
      starting_at: startingAt.trim(),
      availability: availability.trim(),
    });
    setSaving(false);
    setSaved(res.ok);
  }

  return (
    <form onSubmit={onSave} className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Vendor portal</p>
          <h1 className="mt-2 font-serif text-h1 text-ink">
            Settings
          </h1>
          <p className="mt-1 text-ink-soft">
            Your business terms. Name, photos, styles and about live on{" "}
            <span className="font-medium text-forest-700">My Profile</span>.
          </p>
        </div>
        <Button type="submit" variant="primary" size="md" loading={saving}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </header>

      {saved && (
        <p className="rounded-xl bg-forest-100 px-4 py-3 text-sm text-forest-700">
          Saved ✓ — your settings are updated.
        </p>
      )}

      <Panel>
        <h2 className="font-serif text-lg text-ink">Pricing & availability</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Price tier</span>
            <select
              value={priceTier}
              onChange={(e) =>
                setPriceTier(e.target.value as VendorProfile["priceTier"])
              }
              className={selectClass}
            >
              {PRICE_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Starting at</span>
            <Input
              value={startingAt}
              onChange={(e) => setStartingAt(e.target.value)}
              placeholder="e.g. $45,000"
            />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-ink">Availability</span>
            <Input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Open 2025–2026"
            />
          </label>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-serif text-lg text-ink">Business details</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {[
            { label: "Business name", value: vendor.name },
            { label: "Category", value: vendor.category },
            { label: "Base location", value: vendor.location },
            { label: "Service areas", value: vendor.serviceAreas.join(", ") },
            { label: "Instagram", value: vendor.instagram },
            { label: "Website", value: vendor.website },
          ].map((f) => (
            <div key={f.label} className="border-b border-border/70 pb-4">
              <dt className="text-xs uppercase tracking-wider text-ink-faint">
                {f.label}
              </dt>
              <dd className="mt-1 font-serif text-lg text-ink">
                {f.value || "—"}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-ink-soft">
          Edit these on{" "}
          <span className="font-medium text-forest-700">My Profile</span>.
        </p>
      </Panel>
    </form>
  );
}
