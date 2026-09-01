import { Reveal } from "@/components/ui/reveal";
import {
  KalashDivider,
  MandalaCornerSoft,
  TempleArch,
  LeafVine,
  DiyaRow,
} from "@/components/brand/patterns";
import { CurveDivider } from "@/components/brand/motifs";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { features } from "@/lib/mock-data";

/**
 * Platform Features — the 10 core features on a deep-forest "gold on green"
 * ground (old-India luxury): a richer paisley fabric, a temple-arch behind the
 * heading, a gold leaf-vine + diya row, and gold-on-forest cards. Flows in/out
 * of the surrounding light sections via CurveDividers (same pattern as the
 * testimonials section). All depth is STATIC (tiled SVG + inline line-art) plus
 * the existing one-shot Reveal staggers + parallax corners — no new continuous
 * motion or blur (cap untouched).
 */
export function PlatformFeatures() {
  return (
    <>
      {/* Wave transition down into the forest panel from the light section above. */}
      <CurveDivider fill="var(--forest-900)" />

      <section
        id="features"
        className="section texture-saree relative overflow-hidden bg-forest-900"
      >
        {/* Refined gold corner flourishes, drifting gently with scroll. */}
        <ParallaxLayer speed={0.04} className="pointer-events-none absolute -left-8 -top-8">
          <MandalaCornerSoft className="h-40 w-40 text-gold-400/25 sm:h-52 sm:w-52" />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.04} className="pointer-events-none absolute -bottom-8 -right-8">
          <MandalaCornerSoft className="h-40 w-40 rotate-180 text-gold-400/25 sm:h-52 sm:w-52" />
        </ParallaxLayer>

        <div className="container-luxe relative">
          {/* Temple arch behind the heading — the "old India" focal ornament. */}
          <div className="relative">
            <TempleArch className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-72 -translate-x-1/2 -translate-y-[54%] text-gold-400/25" />
            <Reveal className="relative mx-auto max-w-2xl text-center">
              <p className="eyebrow text-gold-400">Everything, gathered</p>
              <h2 className="mt-4 font-serif text-h2 text-cream">
                One elegant home for
                <span className="italic text-gold-400"> the entire journey</span>
              </h2>
              <p className="lede mx-auto mt-4 text-cream/75">
                From the first spark of inspiration to the final farewell — ten
                considered tools working in concert.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <DiyaRow className="mt-10 text-gold-400/90" count={5} />
          </Reveal>
          <Reveal>
            <LeafVine className="mx-auto mt-6 h-8 max-w-2xl text-gold-400/70" />
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-4 md:grid-cols-2 lg:gap-x-12">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={(i % 2) * 60}>
                  <div className="group relative flex gap-5 rounded-2xl border border-cream/10 bg-cream/[0.06] py-6 pl-6 pr-5 ring-1 ring-cream/5 transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-gold-400/40 hover:bg-cream/[0.09]">
                    {/* Gold left-rule that grows in on hover. */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-6 bottom-6 w-0.5 origin-top scale-y-0 rounded-full bg-gold-400 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-y-100"
                    />
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream/10 text-gold-400 transition-colors duration-[var(--dur-base)] group-hover:bg-gold-400 group-hover:text-forest-900">
                      <Icon className="h-[1.4rem] w-[1.4rem]" strokeWidth={1.6} aria-hidden />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className="font-serif text-sm tabular-nums text-gold-400/70"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif text-xl text-cream">{f.title}</h3>
                      </div>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/70">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <KalashDivider className="draw mt-14 text-gold-400" />
          </Reveal>
        </div>
      </section>

      {/* Wave transition back up into the light section below. */}
      <CurveDivider flip fill="var(--forest-900)" />
    </>
  );
}
