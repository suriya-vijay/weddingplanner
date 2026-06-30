import type { Metadata } from "next";
import { Gallery } from "@/components/inspiration/gallery";
import { DividerOrnament } from "@/components/brand/motifs";

export const metadata: Metadata = {
  title: "Inspiration Gallery · Kalyanam & Co.",
  description:
    "Explore real luxury Indian weddings — browse by ceremony, tradition, colour, budget and location, and save ideas to your mood boards.",
};

export default function InspirationPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-forest-900 pb-16 pt-36 text-center">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400">Real weddings · Curated</p>
          <h1 className="mt-4 font-serif text-h1 text-cream">
            The Inspiration
            <span className="italic text-gold-400"> Gallery</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-2xl text-cream/75">
            A living library of luxury Indian celebrations. Save what you love,
            build your mood boards, and hire the very vendors behind each one.
          </p>
          <DividerOrnament className="mt-10" />
        </div>
      </section>

      {/* Gallery */}
      <section className="section bg-cream">
        <div className="container-luxe">
          <Gallery />
        </div>
      </section>
    </>
  );
}
