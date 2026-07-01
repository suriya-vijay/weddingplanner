import type { Metadata } from "next";
import { Marketplace } from "@/components/vendors/marketplace";
import { DividerOrnament } from "@/components/brand/motifs";

export const metadata: Metadata = {
  title: "Vendor Marketplace · Kalyanam & Co.",
  description:
    "Discover trusted luxury wedding vendors — photographers, decorators, caterers, makeup artists and more. Filter by category, location and style.",
};

export default function VendorsPage() {
  return (
    <>
      <section className="bg-forest-900 pb-16 pt-36 text-center">
        <div className="container-luxe">
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

      <section className="section bg-cream">
        <div className="container-luxe">
          <Marketplace />
        </div>
      </section>
    </>
  );
}
