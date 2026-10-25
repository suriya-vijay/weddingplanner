/**
 * Supabase never throws: a failed or RLS-blocked write comes back as
 * `{ error }`, or as success with zero rows. Code that just `await`s the call
 * reports success either way, so the client's optimistic UI never rolls back
 * and the change silently vanishes on reload.
 *
 * Chain `.select("id")` onto the update/delete and pass the result here: it
 * throws when nothing was written, which rejects the server action and fires
 * the caller's `.catch()` rollback.
 */
export function expectRows(
  res: { error: unknown; data: unknown[] | null },
  what = "change",
): void {
  if (res.error || !res.data?.length) {
    throw new Error(`Couldn’t save this ${what}.`);
  }
}
