"use client";

import { useState } from "react";
import { Image as ImageIcon, Save } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { VendorProfile } from "@/lib/mock-data";

/**
 * Vendor "My Profile" — an editable-looking form prefilled from the vendor's
 * public profile. All edits live in local state and are NOT saved (backend
 * later). The cover/logo are gradient plates; image upload is a placeholder.
 */
export function VendorProfileView({ vendor }: { vendor: VendorProfile }) {
  const [name, setName] = useState(vendor.name);
  const [tagline, setTagline] = useState(vendor.tagline);
  const [category, setCategory] = useState(vendor.category);
  const [location, setLocation] = useState(vendor.location);
  const [about, setAbout] = useState(vendor.about);
  const [instagram, setInstagram] = useState(vendor.instagram);
  const [website, setWebsite] = useState(vendor.website);
  const [saved, setSaved] = useState(false);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <form onSubmit={onSave} className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Vendor portal</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            My profile
          </h1>
          <p className="mt-1 text-ink-soft">
            This is how couples see your business. Edits here are a preview —
            saving goes live with the backend.
          </p>
        </div>
        <Button type="submit" variant="primary" size="md">
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </header>

      {saved && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
          Preview only — your changes aren’t saved yet. Publishing arrives with
          the backend.
        </p>
      )}

      {/* Cover + logo */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">Cover & logo</h2>
        <div
          aria-hidden
          className="mt-4 h-40 w-full rounded-2xl"
          style={{ background: vendor.cover }}
        />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-cream/70"
            style={{ background: vendor.logoPlate }}
          >
            <ImageIcon className="h-6 w-6" />
          </span>
          <button
            type="button"
            className="rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-gold-400 hover:text-forest-700"
          >
            Upload logo &amp; cover (coming soon)
          </button>
        </div>
      </Panel>

      {/* Business details */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">Business details</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Business name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="Base location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </Field>
          <Field label="Instagram">
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </Field>
          <Field label="Website" className="sm:col-span-2">
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
          </Field>
        </div>
      </Panel>

      {/* About */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">About</h2>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="mt-4 w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
        />
        <div className="mt-4">
          <p className="text-sm font-medium text-ink">Styles</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {vendor.styles.map((s) => (
              <Badge key={s} tone="forest">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </Panel>

      {/* Service areas */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">Service areas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {vendor.serviceAreas.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border-strong bg-ivory px-3 py-1.5 text-sm text-ink-soft"
            >
              {a}
            </span>
          ))}
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
