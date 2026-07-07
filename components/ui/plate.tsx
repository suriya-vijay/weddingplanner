import { cn } from "@/lib/utils";

/** A stored image URL (http(s) or root-relative) vs a CSS gradient "plate". */
export function isImageUrl(v?: string | null): v is string {
  return !!v && (/^https?:\/\//.test(v) || v.startsWith("/"));
}

/**
 * A "plate": renders an uploaded image when a real URL is present, else the
 * gradient `fallback` (a CSS `background` value). Graceful degradation — no
 * broken <img> when an entity has no image yet. Plain <img loading="lazy">
 * (the app uses CSS-gradient plates, not next/image).
 *
 * `imageUrl` is tolerant: if it's actually a gradient string (the collapsed
 * `cover`/`logoPlate` values from lib/db can be either), it's treated as the
 * fallback rather than rendered as a broken <img>.
 */
export function Plate({
  imageUrl,
  fallback,
  alt = "",
  className,
  children,
}: {
  imageUrl?: string | null;
  fallback?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  // Tolerate a single collapsed value that may be a URL or a gradient.
  if (imageUrl && !isImageUrl(imageUrl) && !fallback) {
    fallback = imageUrl;
    imageUrl = null;
  }
  if (isImageUrl(imageUrl)) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        {/* Supabase Storage URL; next/image not used in this project. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {children}
      </span>
    );
  }
  return (
    <span
      aria-hidden={!alt}
      className={cn("relative block", className)}
      style={{ background: fallback }}
    >
      {children}
    </span>
  );
}
