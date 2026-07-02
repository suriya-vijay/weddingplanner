import { createServerClient } from "@supabase/ssr";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server Supabase client — for Server Components, Server Actions and Route
 * Handlers. Bound to the request cookies so the auth session is read/refreshed.
 * Uses the current getAll/setAll cookie adapter (not the deprecated get/set/remove).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only cookies). Safe to ignore
            // — the middleware refreshes the session cookie on each request.
          }
        },
      },
    },
  );
}

/**
 * Service-role Supabase client — bypasses RLS. SERVER-ONLY, use sparingly
 * (e.g. auto-confirming a signup, admin seed tasks). Never expose to the client.
 */
export function createServiceClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
