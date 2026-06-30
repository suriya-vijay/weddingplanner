import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { MandalaRing, LotusMark } from "@/components/brand/motifs";
import { MandalaCorner } from "@/components/brand/patterns";

/**
 * Closing CTA band — gold-warm forest ground with a faint paisley fabric
 * texture, gold mandala corners + center mandala. Single primary action.
 * Perf: all static — no animation, no blur.
 */
export function Cta() {
  return (
    <section id="contact" className="section bg-cream">
      <div className="container-luxe">
        <Reveal>
          <div
            className="texture-paisley on-dark relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-[var(--shadow-lg)] sm:px-16 sm:py-24"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, rgba(45,106,79,0.95) 0%, rgba(27,67,50,0.97) 55%, #0f2c1f 100%)",
            }}
          >
            {/* Gold mandala corners (static) */}
            <MandalaCorner className="pointer-events-none absolute left-0 top-0 h-32 w-32 text-gold-400/30 sm:h-40 sm:w-40" />
            <MandalaCorner className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rotate-180 text-gold-400/25 sm:h-40 sm:w-40" />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 text-gold-400/10"
            >
              <MandalaRing />
            </div>

            <div className="relative mx-auto max-w-2xl">
              {/* One-shot draw-in lotus (animates once on reveal; static after) */}
              <LotusMark className="draw mx-auto mb-5 h-10 w-10 text-gold-400" />
              <p className="eyebrow text-gold-400">Where forever takes shape</p>
              <h2 className="mt-5 font-serif text-h2 text-cream">
                Let’s begin the wedding
                <span className="italic text-gold-400"> of a lifetime</span>
              </h2>
              <p className="lede mx-auto mt-5 text-cream/75">
                Create your wedding profile in minutes, invite your family, and
                meet the planner who’ll bring it all to life.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href="/signup" variant="primary" size="lg">
                  Create Your Wedding
                </Button>
                <Button
                  href="/signup"
                  variant="ghost"
                  size="lg"
                  className="text-cream hover:bg-cream/10"
                >
                  Become a Vendor
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
