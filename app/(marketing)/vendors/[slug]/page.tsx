import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  BadgeCheck,
  Globe,
  CalendarCheck,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vendors, getVendorBySlug } from "@/lib/mock-data";

/** Instagram glyph (lucide dropped this export). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor · Kalyanam & Co." };
  return {
    title: `${vendor.name} · Kalyanam & Co.`,
    description: vendor.tagline,
  };
}

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) notFound();

  return (
    <article className="pb-24">
      {/* Cover */}
      <div className="relative h-[38vh] min-h-[18rem] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: vendor.cover }} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/20 to-forest-900/30" />
        <div className="container-luxe relative flex h-full flex-col justify-end pb-8 pt-28">
          <Link
            href="/vendors"
            className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-forest-900/40 px-3 py-1.5 text-sm text-cream transition-colors hover:bg-forest-900/60"
          >
            <ArrowLeft className="h-4 w-4" /> All vendors
          </Link>
        </div>
      </div>

      {/* Header row: logo (overlaps cover) + name + CTA */}
      <div className="container-luxe">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <span
              aria-hidden
              className="-mt-16 h-28 w-28 shrink-0 rounded-3xl border-4 border-cream shadow-[var(--shadow-md)]"
              style={{ background: vendor.logoPlate }}
            />
            <div className="pb-1 pt-5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
                  {vendor.category}
                </p>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-700">
                    <BadgeCheck className="h-4 w-4" /> Verified
                  </span>
                )}
              </div>
              <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">
                {vendor.name}
              </h1>
              <p className="mt-1 text-ink-soft">{vendor.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button href="/signup" variant="primary" size="lg">
              Enquire now
            </Button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-5 text-sm">
          <span className="inline-flex items-center gap-1.5 text-ink">
            <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
            <strong>{vendor.rating.toFixed(1)}</strong>
            <span className="text-ink-soft">({vendor.reviews} reviews)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <MapPin className="h-4 w-4 text-gold-600" /> {vendor.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <CalendarCheck className="h-4 w-4 text-gold-600" /> {vendor.availability}
          </span>
          <span className="text-ink-soft">
            From <strong className="font-serif text-forest-700">{vendor.startingAt}</strong>
          </span>
        </div>

        {/* Body grid */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          {/* Left column */}
          <div className="space-y-12">
            {/* Gallery */}
            <section>
              <h2 className="font-serif text-2xl text-ink">Portfolio</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vendor.gallery.map((plate, i) => (
                  <div
                    key={i}
                    className="group aspect-square overflow-hidden rounded-2xl shadow-[var(--shadow-xs)]"
                  >
                    <div
                      aria-hidden
                      className="h-full w-full transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                      style={{ background: plate }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="font-serif text-2xl text-ink">About</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                {vendor.about}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {vendor.styles.map((s) => (
                  <Badge key={s} tone="forest">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Packages */}
            <section>
              <h2 className="font-serif text-2xl text-ink">Packages</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {vendor.packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-sm)]"
                  >
                    <p className="text-sm font-medium uppercase tracking-wider text-gold-600">
                      {pkg.name}
                    </p>
                    <p className="mt-1 font-serif text-2xl text-ink">{pkg.price}</p>
                    <ul className="mt-4 space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="font-serif text-2xl text-ink">Reviews</h2>
              <div className="mt-5 space-y-4">
                {vendor.reviewList.map((r, i) => (
                  <figure
                    key={i}
                    className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-xs)]"
                  >
                    <div className="flex items-center gap-1 text-gold-500">
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-gold-500" />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-ink-soft">“{r.text}”</blockquote>
                    <figcaption className="mt-3 text-sm">
                      <span className="font-medium text-ink">{r.author}</span>
                      <span className="text-ink-faint"> · {r.wedding}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </div>

          {/* Right column: sticky contact card */}
          <aside>
            <div className="sticky top-28 space-y-5 rounded-3xl border border-border bg-ivory p-6 shadow-[var(--shadow-md)]">
              <div>
                <p className="text-sm text-ink-soft">Starting at</p>
                <p className="font-serif text-3xl text-forest-700">
                  {vendor.startingAt}
                </p>
              </div>
              <Button href="/signup" variant="primary" size="lg" className="w-full">
                Enquire now
              </Button>
              <Button href="/signup" variant="outline" size="lg" className="w-full">
                Save vendor
              </Button>

              <div className="space-y-3 border-t border-border pt-5 text-sm">
                <p className="flex items-center gap-2 text-ink-soft">
                  <MapPin className="h-4 w-4 text-gold-600" /> Serves:{" "}
                  {vendor.serviceAreas.join(", ")}
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-forest-700 hover:text-gold-600"
                >
                  <InstagramIcon className="h-4 w-4" /> {vendor.instagram}
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-forest-700 hover:text-gold-600"
                >
                  <Globe className="h-4 w-4" /> {vendor.website}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
