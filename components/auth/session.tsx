"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

/**
 * Mock session — a DEMO-ONLY auth layer. There is no real authentication here:
 * we store a fake "signed-in user" in localStorage so the header, sidebars and
 * auth forms can reflect a signed-in state and role-gate links. Real auth +
 * roles arrive with the backend (Supabase). Do not treat any of this as secure.
 */

export type Role = "couple" | "admin" | "vendor";
export type DemoUser = { name: string; role: Role };

const STORAGE_KEY = "kalyanam.demoUser";

/** Default display names per role (mock). */
const DEFAULT_NAMES: Record<Role, string> = {
  couple: "Aanya & Vikram",
  admin: "Kalyanam Admin",
  vendor: "Vendor Partner",
};

// ── tiny external store over localStorage ───────────────────────
// useSyncExternalStore gives us an SSR-safe read (server snapshot = null) with
// no hydration mismatch and no setState-in-effect.

function read(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

// Cache the parsed value so getSnapshot returns a stable reference between
// writes (useSyncExternalStore requires referential stability to avoid loops).
let cache: DemoUser | null = read();

function write(user: DemoUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
  cache = user;
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Sync across tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => cache;
const getServerSnapshot = (): DemoUser | null => null;

// ── context ─────────────────────────────────────────────────────
type SessionValue = {
  user: DemoUser | null;
  signIn: (role: Role, name?: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const signIn = useCallback((role: Role, name?: string) => {
    write({ role, name: name?.trim() || DEFAULT_NAMES[role] });
  }, []);

  const signOut = useCallback(() => write(null), []);

  return (
    <SessionContext.Provider value={{ user, signIn, signOut }}>
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
