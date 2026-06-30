import { Reveal } from "@/components/ui/reveal";
import { KalashDivider } from "@/components/brand/patterns";
import { features } from "@/lib/mock-data";

/**
 * Platform Features — the 10 core features. Editorial two-column intro, then a
 * refined feature list (icon + copy with a left gold rule on hover). Avoids the
 * generic centered icon-in-a-circle grid.
 */
export function PlatformFeatures() {
  return (
    <section id="features" className="section bg-cream">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Everything, gathered</p>
          <h2 className="mt-4 font-serif text-h2 text-ink">
            One elegant home for
            <span className="italic text-forest-700"> the entire journey</span>
          </h2>
          <p className="lede mx-auto mt-4">
            From the first spark of inspiration to the final farewell — ten
            considered tools, and one human planner, working in concert.
          </p>
        </Reveal>

        <Reveal>
          <KalashDivider className="draw my-12" />
        </Reveal>

        <div className="grid gap-x-10 gap-y-2 md:grid-cols-2 lg:gap-x-16">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 2) * 60}>
                <div className="group flex gap-5 rounded-2xl border-l-2 border-transparent py-6 pl-5 transition-all duration-[var(--dur-base)] hover:border-gold-400 hover:bg-cream-deep/40">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition-colors duration-[var(--dur-base)] group-hover:bg-forest-700 group-hover:text-gold-400">
                    <Icon className="h-[1.4rem] w-[1.4rem]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-ink">{f.title}</h3>
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
