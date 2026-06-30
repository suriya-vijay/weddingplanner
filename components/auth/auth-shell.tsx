import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MandalaRing } from "@/components/brand/motifs";
import { MandalaCorner } from "@/components/brand/patterns";
import { cn } from "@/lib/utils";

/**
 * Split-screen auth layout: form on the left, a branded forest/gold panel on
 * the right (hidden on mobile). Static motifs only — no animation here, so the
 * auth pages stay light. Reuses Logo + mandala motifs from the landing page.
 */
export function AuthShell({
  children,
  panelTitle,
  panelText,
  panelQuote,
}: {
  children: React.ReactNode;
  panelTitle: string;
  panelText: string;
  panelQuote?: { quote: string; name: string };
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Left: form */}
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16">
        <Logo tone="ink" />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-ink-faint lg:text-left">
          © {new Date().getFullYear()} Kalyanam &amp; Co. · Where Forever Takes Shape
        </p>
      </div>

      {/* Right: branded panel (hidden on small screens) */}
      <div
        className="texture-paisley on-dark relative hidden w-full overflow-hidden bg-forest-900 lg:block lg:w-[44%]"
        style={{
          background:
            "radial-gradient(120% 100% at 70% 10%, rgba(45,106,79,0.95) 0%, rgba(27,67,50,0.97) 55%, #0b2017 100%)",
        }}
      >
        <MandalaCorner className="pointer-events-none absolute right-0 top-0 h-48 w-48 rotate-90 text-gold-400/25" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[36rem] w-[36rem] text-gold-400/[0.10]"
        >
          <MandalaRing />
        </div>

        <div className="relative flex h-full flex-col justify-center px-14 py-16">
          <p className="eyebrow text-gold-400">Kalyanam &amp; Co.</p>
          <h2 className="mt-5 max-w-md font-serif text-[2.6rem] leading-[1.1] text-cream">
            {panelTitle}
          </h2>
          <p className="mt-5 max-w-sm text-cream/70">{panelText}</p>

          {panelQuote && (
            <figure className="mt-12 max-w-sm rounded-2xl bg-cream/[0.06] p-6 ring-1 ring-cream/10">
              <blockquote className="font-serif text-lg italic leading-snug text-cream/90">
                “{panelQuote.quote}”
              </blockquote>
              <figcaption className="mt-3 text-sm text-gold-400">
                — {panelQuote.name}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}

/** Labeled form field with optional error message (shown below). */
export function AuthField({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Continue with Google" button — brand-styled, with the Google glyph. */
export function GoogleButton({
  label = "Continue with Google",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border-strong bg-ivory",
        "text-[0.95rem] font-medium text-ink",
        "transition-all duration-[var(--dur-fast)] hover:border-gold-300 hover:bg-cream-deep/50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        "active:scale-[0.99] cursor-pointer",
      )}
    >
      <GoogleGlyph />
      {label}
    </button>
  );
}

/** "or" divider with hairline rules. */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wider text-ink-faint">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Link row beneath the form (e.g. "Don't have an account? Sign up"). */
export function AuthSwitch({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="text-center text-sm text-ink-soft">
      {text}{" "}
      <Link
        href={href}
        className="font-medium text-forest-700 underline-offset-4 hover:text-gold-600 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}

function GoogleGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
