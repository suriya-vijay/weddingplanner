import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { MandalaRing } from "@/components/brand/motifs";

/**
 * Closing CTA band — gold-warm ground with a faint mandala, a single primary
 * action (UX Bible: one primary CTA per view).
 */
export function Cta() {
  return (
    <section id="contact" className="section bg-cream">
      <div className="container-luxe">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-[var(--shadow-lg)] sm:px-16 sm:py-24"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, #2d6a4f 0%, #1b4332 55%, #0f2c1f 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 text-gold-400/10"
            >
              <MandalaRing />
            </div>

            <div className="relative mx-auto max-w-2xl">
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
