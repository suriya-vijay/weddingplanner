"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plate, isImageUrl } from "@/components/ui/plate";
import { ImageUpload } from "@/components/ui/image-upload";
import type { VendorProfile } from "@/lib/mock-data";
import { updateVendorProfileAction } from "@/app/(vendor)/vendor/actions";

/**
 * Vendor "My Profile" — an editable form prefilled from the vendor's public
 * profile. Text fields persist via updateVendorProfileAction on Save; cover/
 * logo images upload to Supabase Storage and persist immediately. Cover/logo
 * fall back to their gradient plate when no image has been uploaded.
 */
export function VendorProfileView({
  vendor,
  userId,
}: {
  vendor: VendorProfile;
  userId: string;
}) {
  const [name, setName] = useState(vendor.name);
  const [tagline, setTagline] = useState(vendor.tagline);
  const [category, setCategory] = useState(vendor.category);
  const [location, setLocation] = useState(vendor.location);
  const [about, setAbout] = useState(vendor.about);
  const [instagram, setInstagram] = useState(vendor.instagram);
  const [website, setWebsite] = useState(vendor.website);
  const [cover, setCover] = useState(vendor.cover);
  const [logo, setLogo] = useState(vendor.logoPlate);
  const [saved, setSaved] = useState(false);

  const [saving, setSaving] = useState(false);

  // Persist a freshly uploaded image URL immediately (independent of the
  // text-field Save), so a refresh keeps it.
  async function persistImage(patch: { cover_url?: string; logo_url?: string }) {
    await updateVendorProfileAction(patch);
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await updateVendorProfileAction({
      name: name.trim(),
      tagline: tagline.trim(),
      category: category.trim(),
      location: location.trim(),
      about: about.trim(),
      instagram: instagram.trim(),
      website: website.trim(),
    });
    setSaving(false);
    setSaved(res.ok);
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
            This is how couples see your business. Text details save live; photo
            upload arrives in the next stage.
          </p>
        </div>
        <Button type="submit" variant="primary" size="md" loading={saving}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </header>

      {saved && (
        <p className="rounded-xl bg-forest-100 px-4 py-3 text-sm text-forest-700">
          Saved ✓ — your profile is updated.
        </p>
      )}

      {/* Cover + logo */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">Cover & logo</h2>

        <Plate
          imageUrl={isImageUrl(cover) ? cover : null}
          fallback={cover}
          alt="Cover image"
          className="mt-4 h-40 w-full rounded-2xl"
        />

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Cover image</p>
            <ImageUpload
              bucket="vendor-media"
              folder={userId}
              label="cover"
              currentUrl={isImageUrl(cover) ? cover : null}
              fallback={cover}
              buttonText="Upload cover"
              onUploaded={(url) => {
                setCover(url);
                persistImage({ cover_url: url });
              }}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Logo</p>
            <ImageUpload
              bucket="vendor-media"
              folder={userId}
              label="logo"
              currentUrl={isImageUrl(logo) ? logo : null}
              fallback={logo}
              buttonText="Upload logo"
              onUploaded={(url) => {
                setLogo(url);
                persistImage({ logo_url: url });
              }}
            />
          </div>
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
