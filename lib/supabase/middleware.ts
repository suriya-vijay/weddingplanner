import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Panels that require a signed-in user, and the role each requires. */
const ROLE_GATES: { prefix: string; role: "couple" | "admin" | "vendor" }[] = [
  { prefix: "/dashboard", role: "couple" },
  { prefix: "/admin", role: "admin" },
  { prefix: "/vendor", role: "vendor" },
];

/** Where each role "lives" — used to redirect a mismatched user home. */
const HOME_FOR: Record<string, string> = {
  couple: "/dashboard",
  admin: "/admin",
  vendor: "/vendor",
};

/**
 * Refresh the auth session cookie on every request AND gate the panel routes by
 * role. Returns a NextResponse (possibly a redirect). Note: `/vendors` (public
 * marketplace) is deliberately NOT gated — only the exact `/vendor` portal is.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() (not getSession) — it revalidates the token with the
  // auth server. Must run right after client creation, before any other logic.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // Match the vendor portal exactly ("/vendor" or "/vendor/..."), never the
  // public "/vendors" marketplace.
  const gate = ROLE_GATES.find(
    (g) => path === g.prefix || path.startsWith(g.prefix + "/"),
  );

  if (gate) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    // Deny by default. This used to read `if (role && role !== gate.role)`,
    // which FAILED OPEN: a signed-in user with no role in their metadata (e.g.
    // an account created outside signUpAction) matched nothing and was allowed
    // straight into /admin.
    const role = (user.app_metadata?.role ??
      user.user_metadata?.role) as string | undefined;
    if (role !== gate.role) {
      const url = request.nextUrl.clone();
      url.pathname = (role && HOME_FOR[role]) || "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
