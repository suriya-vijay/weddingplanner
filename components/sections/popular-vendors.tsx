import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { CurveDivider } from "@/components/brand/motifs";
import { vendorCategories } from "@/lib/mock-data";
import { getFeaturedVendors } from "@/lib/db/vendors";
import { VendorCard } from "@/components/vendors/marketplace";

/**
 * Popular Vendors — a marketplace teaser. Category pills + a row of vendor
 * cards. Sunken cream-deep ground, curved divider in/out (non-boxy).
 */
export async function PopularVendors() {
  // Real, approved vendors — the old mock cards showed invented ratings and
  // linked to profiles that may not exist.
  const vendors = await getFeaturedVendors(4);
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
                  href={`/vendors?looking=${encodeURIComponent(c)}`}
                  className="rounded-full border border-border-strong bg-ivory px-4 py-2 text-sm text-ink-soft transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-gold-400 hover:text-forest-700 hover:shadow-[var(--shadow-sm)]"
                >
                  {c}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Vendor cards */}
          {vendors.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vendors.map((v, i) => (
                <Reveal key={v.slug} delay={i * 60}>
                  <VendorCard vendor={v} />
                </Reveal>
              ))}
            </div>
          )}

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

