import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/mock-data";

/**
 * FAQ — editorial two-column: sticky heading left, accordion right.
 */
export function Faq() {
  return (
    <section className="section bg-cream">
      <div className="container-luxe grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Everything you
              <span className="italic text-forest-700"> wondered</span>
            </h2>
            <p className="lede mt-4">
              Still curious? Our team — and your assigned planner — are only ever
              a message away.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
