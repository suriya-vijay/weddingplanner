import { Reveal } from "@/components/ui/reveal";
import { KalashDivider, MandalaCornerSoft } from "@/components/brand/patterns";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { features } from "@/lib/mock-data";

/**
 * Platform Features — the 10 core features. A warm SUNKEN ground with a faint
 * gold paisley texture and mandala-corner flourishes lifts it out of the flat
 * "tan background" it used to be. Editorial centered intro, then a two-column
 * numbered feature list — each row a card that elevates on hover with a gold
 * left-rule. All depth is STATIC (radial wash + tiled SVG + inline motifs) plus
 * one-shot Reveal staggers; no continuous motion or blur (cap untouched).
 */
export function PlatformFeatures() {
  return (
    <section
      id="features"
      className="section texture-paisley on-light bg-sunken relative overflow-hidden"
    >
      {/* Refined gold flourishes anchoring the corners — drifting gently with
          scroll via ParallaxLayer (opposite directions for a subtle depth). */}
      <ParallaxLayer speed={0.04} className="pointer-events-none absolute -left-8 -top-8">
        <MandalaCornerSoft className="h-40 w-40 text-gold-500/20 sm:h-52 sm:w-52" />
      </ParallaxLayer>
      <ParallaxLayer speed={-0.04} className="pointer-events-none absolute -bottom-8 -right-8">
        <MandalaCornerSoft className="h-40 w-40 rotate-180 text-gold-500/20 sm:h-52 sm:w-52" />
      </ParallaxLayer>

      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Everything, gathered</p>
          <h2 className="mt-4 font-serif text-h2 text-ink">
            One elegant home for
            <span className="italic text-forest-700"> the entire journey</span>
          </h2>
          <p className="lede mx-auto mt-4">
            From the first spark of inspiration to the final farewell — ten
            considered tools working in concert.
          </p>
        </Reveal>

        <Reveal>
          <KalashDivider className="draw my-12" />
        </Reveal>

        <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 lg:gap-x-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 2) * 60}>
                <div className="group relative flex gap-5 rounded-2xl border border-transparent bg-ivory/50 py-6 pl-6 pr-5 shadow-[var(--shadow-xs)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-gold-200 hover:bg-ivory hover:shadow-[var(--shadow-md)]">
                  {/* Gold left-rule that grows in on hover. */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-6 bottom-6 w-0.5 origin-top scale-y-0 rounded-full bg-gold-400 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-y-100"
                  />
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition-colors duration-[var(--dur-base)] group-hover:bg-forest-700 group-hover:text-gold-400">
                    <Icon className="h-[1.4rem] w-[1.4rem]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span
                        aria-hidden
                        className="font-serif text-sm tabular-nums text-gold-500/70"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-xl text-ink">{f.title}</h3>
                    </div>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                      {f.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
