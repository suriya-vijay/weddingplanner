"use client";

import { useState } from "react";
import { Save, UserPlus, Mail, Copy, Check } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { US_CITIES } from "@/lib/data/us-cities";
import {
  updateWeddingAction,
  invitePartnerAction,
} from "@/app/(dashboard)/dashboard/actions";
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
    <div className="space-y-6">
    <form onSubmit={onSubmit}>
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

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <span className="text-sm text-forest-700">
            {saved ? "Saved ✓" : ""}
          </span>
          <Button type="submit" variant="primary" size="md" loading={saving}>
            <Save className="h-4 w-4" /> Save details
          </Button>
        </div>
      </Panel>
    </form>

    <PartnerInvite />
    </div>
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

/**
 * Invite a partner to co-edit this wedding. They create their own login (no
 * shared credentials) and are linked to the same dashboard. The couple can
 * email the invite or copy the link to share however they like (WhatsApp, etc.).
 */
function PartnerInvite() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setLink(null);
    const res = await invitePartnerAction(email.trim());
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Couldn't create the invite.");
      return;
    }
    setLink(res.link ?? null);
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is visible to select manually */
    }
  }

  return (
    <Panel>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
          <UserPlus className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-lg text-ink">Invite your partner</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Planning apart? Invite your partner to co-edit this same dashboard —
            they&rsquo;ll get their own login, no shared passwords.
          </p>
        </div>
      </div>

      <form onSubmit={invite} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="partner@email.com"
          className="flex-1"
        />
        <Button type="submit" variant="primary" size="md" loading={busy} className="shrink-0">
          <Mail className="h-4 w-4" /> Send invite
        </Button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {link && (
        <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50 p-4">
          <p className="text-sm text-ink-soft">
            Invite ready! We emailed it — or copy the link to share directly:
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="flex-1 truncate rounded-lg border border-border bg-ivory px-3 py-2 text-xs text-ink">
              {link}
            </code>
            <Button type="button" variant="outline" size="sm" onClick={copy} className="shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy link
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}
