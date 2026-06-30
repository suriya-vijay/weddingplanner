import { Button } from "@/components/ui/button";
import { MandalaRing } from "@/components/brand/motifs";
import { GlobalSearch } from "./global-search";

/**
 * Hero — full-viewport, editorial. Deep forest ground with a faint, STATIC gold
 * mandala accent, oversized Playfair headline, dual CTA, and the global search
 * nested at the fold. Non-boxy: content sits asymmetrically left.
 * Perf: no animation, no blur filters — gradients only.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-forest-900 pt-32 pb-16">
      {/* Ambient ground */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 10%, #1b4332 0%, #0f2c1f 55%, #0b2017 100%)",
        }}
      />
      {/* Faint static mandala motif, right (no rotation; modest 40rem size) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 hidden h-[40rem] w-[40rem] -translate-y-1/2 text-gold-400/[0.10] md:block"
      >
        <MandalaRing />
      </div>
      {/* Soft blush glow, lower-left — plain gradient, no blur filter */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[34rem] w-[34rem] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #e8b4b8 0%, transparent 68%)" }}
      />

      <div className="container-luxe relative">
        <div className="max-w-3xl">
          <p className="eyebrow text-gold-400">
            The luxury operating system for Indian weddings
          </p>

          <h1 className="mt-6 font-serif font-medium leading-[1.04] text-cream text-h1">
            Where forever
            <br />
            <span className="italic text-gold-400">takes shape</span>.
          </h1>

          <p className="lede mt-7 max-w-xl text-cream/75">
            Inspiration, trusted vendors, planning tools, AI assistance, and your
            own dedicated wedding planner — gathered into one elegant platform,
            for celebrations as singular as your story.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/signup" variant="primary" size="lg">
              Begin Your Journey
            </Button>
            <Button
              href="#inspiration"
              variant="ghost"
              size="lg"
              className="text-cream hover:bg-cream/10"
            >
              Explore Inspiration
            </Button>
          </div>
        </div>

        {/* Global search at the fold */}
        <div className="mt-14 max-w-4xl">
          <GlobalSearch />
        </div>

        {/* Trust strip */}
        <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
          {[
            ["2,400+", "Curated vendors"],
            ["120+", "Cities worldwide"],
            ["4.9/5", "Couple rating"],
          ].map(([stat, label]) => (
            <div key={label}>
              <dt className="font-serif text-3xl text-gold-400">{stat}</dt>
              <dd className="mt-1 text-sm text-cream/55">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
