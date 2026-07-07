import { createClient } from "@/lib/supabase/client";

/**
 * Storage boundary (mirrors the lib/db/* boundary): components call these
 * helpers, never storage.from() directly. Uploads run in the browser with the
 * user's session so storage RLS applies (see 0003_storage.sql).
 */

export type Bucket = "inspiration" | "vendor-media";

function extOf(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  const fromType = file.type.split("/")[1] || "";
  return (fromName || fromType || "jpg").toLowerCase();
}

/**
 * Upload an image to `bucket` under `folder/`, returning its public URL.
 * `folder` is the RLS-significant first path segment:
 *   • vendor-media → must be the signed-in user's id (auth.uid())
 *   • inspiration  → any (admin-gated), e.g. the item id
 */
export async function uploadImage(
  bucket: Bucket,
  folder: string,
  label: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const supabase = createClient();
  const path = `${folder}/${label}-${Date.now()}.${extOf(file)}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
