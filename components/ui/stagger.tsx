import { Reveal } from "@/components/ui/reveal";

/**
 * Staggered entrance for a row/grid of sibling cards.
 *
 * Wraps each child in a one-shot <Reveal> with an increasing delay, so tiles
 * and rows settle in sequence instead of appearing all at once. Motion is
 * opacity + a small translateY (GPU-cheap), fires ONCE via IntersectionObserver
 * and then disconnects — no continuous animation, so it doesn't touch the
 * ambient-motion cap. Reduced-motion renders everything instantly via the
 * global block in globals.css.
 *
 * Per UX-BIBLE §0: 40ms per item, capped at ~6 so a long list never feels slow.
 */
export function Stagger({
  children,
  className,
  step = 40,
  cap = 6,
  as,
}: {
  children: React.ReactNode;
  className?: string;
  /** ms between each child's entrance */
  step?: number;
  /** max number of steps before the delay stops growing */
  cap?: number;
  as?: React.ElementType;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <>
      {items.map((child, i) => (
        <Reveal
          key={i}
          as={as}
          className={className}
          delay={Math.min(i, cap) * step}
        >
          {child}
        </Reveal>
      ))}
    </>
  );
}
