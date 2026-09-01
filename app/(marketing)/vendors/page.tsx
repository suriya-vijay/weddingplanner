import type { Metadata } from "next";
import { Marketplace } from "@/components/vendors/marketplace";
import { DividerOrnament } from "@/components/brand/motifs";
import { WaveHeader } from "@/components/brand/wave-header";
import { getPublicVendors } from "@/lib/db/vendors";

export const metadata: Metadata = {
  title: "Vendor Marketplace · Kalyanam & Co.",
  description:
    "Discover trusted luxury wedding vendors — photographers, decorators, caterers, makeup artists and more. Filter by category, location and style.",
};

export default async function VendorsPage() {
  const vendors = await getPublicVendors();
  return (
    <>
      <section className="texture-saree relative overflow-hidden bg-forest-900 pb-16 pt-36 text-center">
        {/* Interactive shimmering waves (crash-safe: paused off-screen, ~30fps,
            static under reduced-motion). Move the cursor to ripple the surface. */}
        <WaveHeader />
        <div className="container-luxe relative z-10">
          <p className="eyebrow text-gold-400">The marketplace</p>
          <h1 className="mt-4 font-serif text-h1 text-cream">
            The finest wedding
            <span className="italic text-gold-400"> vendors</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-2xl text-cream/75">
            A curated marketplace of trusted luxury vendors — discover, compare
            and book the names behind the weddings you admire.
          </p>
          <DividerOrnament className="mt-10" />
        </div>
      </section>

      {/* Tighter top than `.section`: the filter bar sits right under the hero,
          so the full section padding left a large empty band above it. */}
      <section className="section bg-cream !pt-12">
        <div className="container-luxe">
          <Marketplace vendors={vendors} />
        </div>
      </section>
    </>
  );
}
