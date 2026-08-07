"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/components/auth/session";
import { AuthField, AuthSwitch } from "./auth-shell";

/** Which panel each role lands on after sign-in. */
const PANEL_FOR: Record<Role, string> = {
  couple: "/dashboard",
  admin: "/admin",
  vendor: "/vendor",
};

/**
 * Login form — real Supabase email/password auth. On success, routes to the
 * panel for the account's role (role comes from the DB profile / user metadata,
 * so there is no demo role picker anymore).
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);

    const supabase = createClient();
    let data, error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } catch {
      // Network/backend unreachable (e.g. the server is down) — signInWithPassword
      // throws with no useful message, which previously rendered as "{}".
      setSubmitting(false);
      setFormError(
        "We couldn’t reach the server. Please check your connection and try again in a moment.",
      );
      return;
    }

    if (error) {
      setSubmitting(false);
      setFormError(
        error.message === "Invalid login credentials"
          ? "That email or password doesn’t look right."
          : error.message ||
              "We couldn’t reach the server. Please try again in a moment.",
      );
      return;
    }

    const role = ((data?.user?.user_metadata?.role as string) ?? "couple") as Role;
    const next = searchParams.get("next");
    router.push(next || PANEL_FOR[role]);
    router.refresh();
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-h1 text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-soft">
          Sign in to continue planning your celebration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField label="Email address" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
        </AuthField>

        <AuthField
          label="Password"
          htmlFor="password"
          error={errors.password}
          hint={
            <span className="text-sm text-ink-faint">Forgot password?</span>
          }
        >
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-ink-faint hover:text-forest-700"
            >
              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </AuthField>

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          Sign In
        </Button>

        {formError && (
          <p role="alert" className="rounded-xl bg-blush-100 px-4 py-3 text-center text-sm text-maroon">
            {formError}
          </p>
        )}
      </form>

      <AuthSwitch text="New to Kalyanam?" linkText="Create an account" href="/signup" />
    </div>
  );
}
