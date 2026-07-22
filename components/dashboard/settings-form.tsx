"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { US_CITIES } from "@/lib/data/us-cities";
import { updateWeddingAction } from "@/app/(dashboard)/dashboard/actions";
import type { Wedding } from "@/lib/db/weddings";

/**
 * Editable wedding profile. This is where a couple fills in the details that
 * power the whole dashboard (countdown from the date, budget bars from the
 * total). Persists via a server action; on save the dashboard revalidates.
 */
export function SettingsForm({ wedding }: { wedding: Wedding }) {
  const [partnerA, setPartnerA] = useState(wedding.partnerA);
  const [partnerB, setPartnerB] = useState(wedding.partnerB);
  const [coupleNames, setCoupleNames] = useState(wedding.coupleNames);
  const [date, setDate] = useState(wedding.date ?? "");
  const [city, setCity] = useState(wedding.city);
  const [venue, setVenue] = useState(wedding.venue);
  const [tradition, setTradition] = useState(wedding.tradition);
  const [guestEstimate, setGuestEstimate] = useState(String(wedding.guestEstimate || ""));
  const [totalBudget, setTotalBudget] = useState(String(wedding.totalBudget || ""));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await updateWeddingAction({
      couple_names: coupleNames.trim(),
      partner_a: partnerA.trim(),
      partner_b: partnerB.trim(),
      date: date || null,
      city: city.trim(),
      venue: venue.trim(),
      tradition: tradition.trim(),
      guest_estimate: Number(guestEstimate) || 0,
      total_budget: Number(totalBudget) || 0,
    });
    setSaving(false);
    setSaved(res.ok);
  }

  /** Clear the "Saved ✓" as soon as the couple edits again — otherwise it
   *  lingers and implies unsaved changes are already stored. */
  function edited<T>(setter: (v: T) => void) {
    return (v: T) => {
      if (saved) setSaved(false);
      setter(v);
    };
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Panel>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Couple names (as shown)" className="sm:col-span-2">
            <Input value={coupleNames} onChange={(e) => edited(setCoupleNames)(e.target.value)} placeholder="e.g. Aanya & Vikram" />
          </Field>
          <Field label="Partner one">
            <Input value={partnerA} onChange={(e) => edited(setPartnerA)(e.target.value)} placeholder="e.g. Aanya" />
          </Field>
          <Field label="Partner two">
            <Input value={partnerB} onChange={(e) => edited(setPartnerB)(e.target.value)} placeholder="e.g. Vikram" />
          </Field>
          <Field label="Wedding date">
            <Input type="date" value={date} onChange={(e) => edited(setDate)(e.target.value)} />
          </Field>
          <Field label="City">
            <Combobox
              value={city}
              onChange={edited(setCity)}
              options={US_CITIES}
              placeholder="e.g. Jersey City, NJ"
            />
          </Field>
          <Field label="Venue">
            <Input value={venue} onChange={(e) => edited(setVenue)(e.target.value)} placeholder="e.g. The Grand Ballroom" />
          </Field>
          <Field label="Tradition">
            <Input value={tradition} onChange={(e) => edited(setTradition)(e.target.value)} placeholder="e.g. North Indian · Hindu" />
          </Field>
          <Field label="Guest estimate">
            <Input type="number" inputMode="numeric" value={guestEstimate} onChange={(e) => edited(setGuestEstimate)(e.target.value)} placeholder="e.g. 420" />
          </Field>
          <Field label="Total budget ($)">
            <Input type="number" inputMode="numeric" value={totalBudget} onChange={(e) => edited(setTotalBudget)(e.target.value)} placeholder="e.g. 50000" />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" variant="primary" size="md" loading={saving}>
            <Save className="h-4 w-4" /> Save details
          </Button>
          {saved && <span className="text-sm text-forest-700">Saved ✓</span>}
        </div>
      </Panel>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
