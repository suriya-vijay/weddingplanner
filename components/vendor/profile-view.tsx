"use client";

import { useState } from "react";
import { Save, X, Plus } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plate, isImageUrl } from "@/components/ui/plate";
import { ImageUpload } from "@/components/ui/image-upload";
import { Combobox } from "@/components/ui/combobox";
import { US_CITIES } from "@/lib/data/us-cities";
import { vendorCategories, type VendorProfile } from "@/lib/mock-data";
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
  const [styles, setStyles] = useState<string[]>(vendor.styles);
  const [serviceAreas, setServiceAreas] = useState<string[]>(
    vendor.serviceAreas,
  );
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
      styles,
      service_areas: serviceAreas,
    });
    setSaving(false);
    setSaved(res.ok);
  };

  return (
    <form onSubmit={onSave} className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Vendor portal</p>
          <h1 className="mt-2 font-serif text-h1 text-ink">
            My profile
          </h1>
          <p className="mt-1 text-ink-soft">
            This is how couples see your business. Everything here — details,
            photos, styles and service areas — saves live.
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
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
              className="h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
            >
              <option value="" disabled>
                Choose a category…
              </option>
              {/* Keep any legacy/free-text value selectable so it isn't silently
                  dropped, but nudge toward a real category. */}
              {category && !vendorCategories.includes(category) && (
                <option value={category}>{category} (update this)</option>
              )}
              {vendorCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="Base location">
            <Combobox
              value={location}
              onChange={setLocation}
              options={US_CITIES}
              placeholder="e.g. Fremont, CA"
            />
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
          <ChipEditor
            items={styles}
            onChange={setStyles}
            placeholder="Add a style (e.g. Regal)…"
            tone="forest"
          />
        </div>
      </Panel>

      {/* Service areas */}
      <Panel>
        <h2 className="font-serif text-lg text-ink">Service areas</h2>
        <ChipEditor
          className="mt-3"
          items={serviceAreas}
          onChange={setServiceAreas}
          placeholder="Add a city or region…"
          tone="plain"
          options={US_CITIES}
        />
      </Panel>
    </form>
  );
}

/** Editable chip list: shows chips with an × to remove + an input to add. */
function ChipEditor({
  items,
  onChange,
  placeholder,
  tone,
  className,
  options,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  tone: "forest" | "plain";
  className?: string;
  options?: readonly string[];
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v || items.some((i) => i.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...items, v]);
    setDraft("");
  };

  const remove = (item: string) => onChange(items.filter((i) => i !== item));

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) =>
          tone === "forest" ? (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-sm text-forest-700"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                className="grid h-4 w-4 place-items-center rounded-full text-forest-700/70 hover:bg-forest-700/15 hover:text-forest-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-ivory px-3 py-1.5 text-sm text-ink-soft"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                className="grid h-4 w-4 place-items-center rounded-full text-ink-faint hover:bg-cream-deep hover:text-ink"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ),
        )}
      </div>
      <div className="mt-3 flex gap-2">
        {options ? (
          <Combobox
            value={draft}
            onChange={setDraft}
            options={options}
            placeholder={placeholder}
            className="max-w-xs flex-1"
          />
        ) : (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            className="max-w-xs"
          />
        )}
        <Button type="button" variant="ghost" size="md" onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
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
