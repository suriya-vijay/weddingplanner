import { Button } from "@/components/ui/button";
import { MandalaBloom } from "@/components/brand/motifs";
import { MandalaCornerSoft } from "@/components/brand/patterns";
import { AmbientZone } from "@/components/ui/ambient-zone";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { GlobalSearch } from "./global-search";

/**
 * Hero — full-viewport, editorial, Indian-luxury. Deep forest ground with a
 * faint paisley texture, gold mandala corners, a slowly-turning jewelled
 * mandala, and a drifting gold/blush AURORA behind it for luminous depth.
 * Perf: still exactly 2 ambient motions (mandala spin + aurora drift — the
 * aurora IS the old glow slot, not a 3rd), GPU-friendly (transform +
 * background-position, no blur), PAUSED off-screen via AmbientZone. One small
 * header blur lives in the header, not here. Reduced-motion = fully static.
 */
export function Hero() {
  return (
    <AmbientZone
      as="section"
      /* min-h clamped below 100dvh + tighter top padding: at desktop widths a
         full-height centred box left ~650px of empty ground above the headline. */
      className="texture-saree relative flex min-h-[min(88dvh,52rem)] flex-col justify-center overflow-hidden bg-forest-900 pt-28 pb-20"
    >
      {/* Soft vignette for depth — kept LIGHT so the saree brocade texture
          (on .texture-saree::before) reads through it. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[3]"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 10%, rgba(27,67,50,0.35) 0%, rgba(15,44,31,0.45) 55%, rgba(11,32,23,0.6) 100%)",
        }}
      />
      {/* Refined gold corner flourishes (static, curved petals not stray lines) */}
      <MandalaCornerSoft className="pointer-events-none absolute left-0 top-0 h-40 w-40 text-gold-400/25 sm:h-52 sm:w-52" />
      <MandalaCornerSoft className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rotate-180 text-gold-400/20 sm:h-52 sm:w-52" />
      {/* Aurora — drifting gold/blush light behind the mandala for depth.
          The single glow slot (ambient-aurora), paused off-screen. The outer
          ParallaxLayer only does the scroll translate; centering + the ambient
          animation live on inner elements so the transforms don't collide. */}
      <ParallaxLayer
        speed={0.05}
        className="pointer-events-none absolute -right-40 top-1/2 hidden md:block"
      >
        <div className="-translate-y-1/2">
          <div
            className="ambient-aurora h-[52rem] w-[52rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(230,198,110,0.20) 0%, rgba(232,180,184,0.12) 34%, rgba(20,60,42,0) 66%)",
            }}
          />
        </div>
      </ParallaxLayer>
      {/* Slowly turning jewelled mandala (paused off-screen), with a slightly
          stronger parallax so it reads as the front layer. */}
      <ParallaxLayer
        speed={0.08}
        max={16}
        className="pointer-events-none absolute -right-32 top-1/2 hidden md:block"
      >
        <div className="-translate-y-1/2">
          <div className="ambient-spin h-[42rem] w-[42rem]" style={{ transformOrigin: "center" }}>
            <MandalaBloom />
          </div>
        </div>
      </ParallaxLayer>

      <div className="container-luxe relative">
        <div className="max-w-3xl">
          <p className="eyebrow text-gold-400">
            The luxury operating system for Indian weddings
          </p>

          <h1 className="mt-6 font-serif font-medium leading-[1.04] text-cream text-h1">
            Where forever
            <br />
            {/* Gradient-filled text with a slow traveling shimmer — the gold
                "wave" sweeps across the word (paused off-screen, static under
                reduced-motion). The repeating gradient makes the sweep seamless. */}
            <span
              className="text-shimmer bg-clip-text italic text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, var(--gold-500) 0%, var(--blush-300) 20%, var(--gold-400) 40%, var(--gold-200) 50%, var(--gold-400) 60%, var(--blush-300) 80%, var(--gold-500) 100%)",
              }}
            >
              takes shape
            </span>
            <span className="text-gold-400">.</span>
          </h1>

          <p className="lede mt-7 max-w-xl text-cream/75">
            Inspiration, trusted vendors, planning tools and AI assistance —
            gathered into one elegant platform, for celebrations as singular as
            your story.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/signup" variant="primary" size="lg">
              Begin Your Journey
            </Button>
            <Button
              href="/inspiration"
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

        {/* Trust strip — what the platform actually offers. Deliberately NOT
            numbers: invented counts ("2,400+ vendors") read as dishonest on a
            new marketplace. Swap to real figures once they're worth quoting. */}
        <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
          {[
            ["Hand-vetted", "Every vendor reviewed before listing"],
            ["End-to-end", "Guests, budget, seating & timeline"],
            ["AI-guided", "Planning advice tuned to your traditions"],
          ].map(([stat, label]) => (
            <div key={label} className="max-w-[15rem]">
              <dt className="font-serif text-2xl text-gold-400">{stat}</dt>
              <dd className="mt-1 text-sm text-cream/55">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AmbientZone>
  );
}
