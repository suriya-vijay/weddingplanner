import { ShieldCheck, Lock, LayoutGrid, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { DividerOrnament } from "@/components/brand/motifs";

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
    <section className="section bg-sunken">
      <div className="container-luxe">
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
                <div className="flex h-full flex-col rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-[var(--shadow-md)]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
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
