import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CurveDivider } from "@/components/brand/motifs";
import { testimonials } from "@/lib/mock-data";

/**
 * Testimonials — social proof on a deep forest ground (UX Bible storytelling
 * pattern). Lead quote larger, two supporting quotes beside it.
 */
export function Testimonials() {
  const [lead, ...rest] = testimonials;
  return (
    <>
      <CurveDivider fill="var(--forest-900)" />
      <section id="about" className="bg-forest-900 py-20 sm:py-28">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold-400">Loved by couples & families</p>
            <h2 className="mt-4 font-serif text-h2 text-cream">
              Stories that began
              <span className="italic text-gold-400"> with us</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <figure className="flex h-full flex-col justify-between rounded-3xl bg-cream/[0.06] p-8 ring-1 ring-cream/10 backdrop-blur-sm sm:p-10">
                <div>
                  <Quote className="h-9 w-9 text-gold-400" aria-hidden />
                  <blockquote className="mt-5 font-serif text-2xl leading-snug text-cream sm:text-[1.7rem]">
                    “{lead.quote}”
                  </blockquote>
                </div>
                <Author {...lead} />
              </figure>
            </Reveal>

            <div className="grid gap-6">
              {rest.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <figure className="flex h-full flex-col justify-between rounded-3xl bg-cream/[0.04] p-7 ring-1 ring-cream/10">
                    <blockquote className="text-lg leading-relaxed text-cream/85">
                      “{t.quote}”
                    </blockquote>
                    <Author {...t} />
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CurveDivider flip fill="var(--forest-900)" />
    </>
  );
}

function Author({
  name,
  role,
  initials,
}: {
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <figcaption className="mt-7 flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-500 font-serif text-sm font-semibold text-forest-900">
        {initials}
      </span>
      <span className="flex flex-col">
        <span className="font-medium text-cream">{name}</span>
        <span className="text-sm text-cream/55">{role}</span>
      </span>
    </figcaption>
  );
}
