import { ShieldCheck, Lock, LayoutGrid, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { DividerOrnament } from "@/components/brand/motifs";
import { MandalaCornerSoft } from "@/components/brand/patterns";
import { ParallaxLayer } from "@/components/ui/parallax-layer";

/**
 * Trust & safety — the credibility a new marketplace has to earn. Every claim
 * here is verifiable against a real feature (no invented numbers): the admin
 * approval gate, row-level security, the shipped planning tools, and the
 * cultural framing. Static section with one-shot reveals; no continuous motion.
 */
const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Hand-vetted vendors",
    body: "Every vendor is reviewed by our team before they can appear. No pay-to-list, no unchecked profiles.",
  },
  {
    icon: Lock,
    title: "Your data is yours",
    body: "Your wedding, guests and budget are protected by strict per-account security — and never sold.",
  },
  {
    icon: LayoutGrid,
    title: "Real planning tools",
    body: "Not just a directory: checklist, budget, guest list, seating and an AI advisor, all in one place.",
  },
  {
    icon: Sparkles,
    title: "Made for your traditions",
    body: "Built for Indian-American weddings — from Haldi to Sangeet to the Pheras, in cities across the US.",
  },
] as const;

export function Trust() {
  return (
    <section className="section texture-paisley on-light bg-sunken relative overflow-hidden">
      {/* Corner flourishes drifting with scroll (matches the Features section). */}
      <ParallaxLayer speed={0.04} className="pointer-events-none absolute -right-8 -top-8">
        <MandalaCornerSoft className="h-40 w-40 -scale-x-100 text-gold-500/18 sm:h-52 sm:w-52" />
      </ParallaxLayer>
      <ParallaxLayer speed={-0.04} className="pointer-events-none absolute -bottom-8 -left-8">
        <MandalaCornerSoft className="h-40 w-40 -scale-y-100 text-gold-500/18 sm:h-52 sm:w-52" />
      </ParallaxLayer>

      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why couples trust us</p>
          <h2 className="mt-4 font-serif text-h2 text-ink">
            A platform you can
            <span className="italic text-forest-700"> rely on</span>
          </h2>
          <p className="lede mx-auto mt-4">
            Planning a wedding means trusting people with the biggest day of your
            life. Here&rsquo;s how we earn it.
          </p>
        </Reveal>

        <Reveal>
          <DividerOrnament className="mx-auto my-12" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 60}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-gold-200 hover:shadow-[var(--shadow-md)]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition-colors duration-[var(--dur-base)] group-hover:bg-forest-700 group-hover:text-gold-400">
                    <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
