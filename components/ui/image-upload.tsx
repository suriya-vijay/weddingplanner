"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { uploadImage, type Bucket } from "@/lib/storage/upload";
import { cn } from "@/lib/utils";

/**
 * Client image uploader. Picks a file → uploads to Supabase Storage (RLS
 * applies via the user's session) → calls onUploaded(publicUrl). Shows the
 * current image (or a gradient placeholder) and a conditional spinner while
 * uploading — the only motion here (allowed by the motion cap).
 */
export function ImageUpload({
  bucket,
  folder,
  label,
  currentUrl,
  fallback,
  buttonText = "Upload image",
  onUploaded,
  className,
}: {
  bucket: Bucket;
  /** RLS-significant first path segment (user id for vendor-media). */
  folder: string;
  /** File-name label, e.g. "cover" / "logo" / "inspiration". */
  label: string;
  currentUrl?: string | null;
  fallback?: string;
  buttonText?: string;
  onUploaded: (url: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setBusy(true);
    const res = await uploadImage(bucket, folder, label, file);
    setBusy(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setPreview(res.url);
    onUploaded(res.url);
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <span
        aria-hidden
        className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl text-cream/70"
        style={preview ? undefined : { background: fallback }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-6 w-6" />
        )}
      </span>

      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-gold-400 hover:text-forest-700 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {busy ? "Uploading…" : buttonText}
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}
