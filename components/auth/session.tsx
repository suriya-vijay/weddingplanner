"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Session — now backed by real Supabase auth. The public API is unchanged
 * (`useSession() → { user, signIn?, signOut }`), so header/sidebar/menu
 * consumers don't need edits. The provider is seeded server-side with
 * `initialUser` (from the auth cookie) to avoid any hydration mismatch, then
 * kept in sync via `onAuthStateChange`.
 */

export type Role = "couple" | "admin" | "vendor";
export type SessionUser = { name: string; role: Role };
/** @deprecated legacy alias from the mock phase */
export type DemoUser = SessionUser;

type SessionValue = {
  user: SessionUser | null;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

function toSessionUser(
  meta: Record<string, unknown> | undefined,
  email: string | undefined,
): SessionUser {
  const role = ((meta?.role as string) ?? "couple") as Role;
  const name =
    ((meta?.display_name as string) ?? "").trim() || email || "Member";
  return { name, role };
}

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(
          toSessionUser(
            session.user.user_metadata as Record<string, unknown>,
            session.user.email ?? undefined,
          ),
        );
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <SessionContext.Provider value={{ user, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within <SessionProvider>");
  }
  return ctx;
}

/** Two-letter initials for an avatar, from a display name. */
export function initialsOf(name: string): string {
  const parts = name.replace(/&/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "K";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
