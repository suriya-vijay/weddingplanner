import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { CurveDivider } from "@/components/brand/motifs";
import { popularVendors, vendorCategories, type Vendor } from "@/lib/mock-data";

/**
 * Popular Vendors — a marketplace teaser. Category pills + a row of vendor
 * cards. Sunken cream-deep ground, curved divider in/out (non-boxy).
 */
export function PopularVendors() {
  return (
    <>
      <CurveDivider fill="var(--cream-deep)" />
      <section id="vendors" className="bg-sunken pb-4 pt-2">
        <div className="container-luxe section pt-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The marketplace</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              The finest names,
              <span className="italic text-forest-700"> in one place</span>
            </h2>
            <p className="lede mx-auto mt-4">
              A social marketplace built only for wedding vendors — discover,
              compare and book with confidence.
            </p>
          </Reveal>

          {/* Category pills */}
          <Reveal delay={60}>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {vendorCategories.map((c) => (
                <Link
                  key={c}
                  href="/vendors"
                  className="rounded-full border border-border-strong bg-ivory px-4 py-2 text-sm text-ink-soft transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-gold-400 hover:text-forest-700 hover:shadow-[var(--shadow-sm)]"
                >
                  {c}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Vendor cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularVendors.map((v, i) => (
              <Reveal key={v.name} delay={i * 60}>
                <VendorCard vendor={v} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Button href="/vendors" variant="outline" size="lg">
              Explore all vendors
            </Button>
          </Reveal>
        </div>
      </section>
      <CurveDivider flip fill="var(--cream-deep)" />
    </>
  );
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${slugify(vendor.name)}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-ivory shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-2 hover:border-gold-200 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
          style={{ background: vendor.plate }}
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-forest-700 shadow-[var(--shadow-xs)]">
          <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" aria-hidden />
          {vendor.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
          {vendor.category}
        </p>
        <h3 className="mt-1.5 font-serif text-lg text-ink transition-colors group-hover:text-forest-700">
          {vendor.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-faint">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {vendor.location} · {vendor.reviews} reviews
        </p>
        <div className="mt-auto pt-4">
          <span className="text-xs text-ink-soft">Starting at </span>
          <span className="font-serif text-base text-forest-700">
            {vendor.startingAt}
          </span>
        </div>
      </div>
    </Link>
  );
}
