"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthField,
  GoogleButton,
  AuthDivider,
  AuthSwitch,
} from "./auth-shell";

/**
 * Login form — UI only this phase (validates, then shows a "demo" notice;
 * real Supabase auth comes later). Lightweight: plain React state, no form libs.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(false);
    if (!validate()) return;
    setSubmitting(true);
    // No backend yet — simulate, then show a friendly notice.
    setTimeout(() => {
      setSubmitting(false);
      setNotice(true);
    }, 700);
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-ink-soft">
          Sign in to continue planning your celebration.
        </p>
      </div>

      <GoogleButton onClick={() => setNotice(true)} />
      <AuthDivider label="or sign in with email" />

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
            <a
              href="#"
              className="text-sm font-medium text-forest-700 hover:text-gold-600"
            >
              Forgot password?
            </a>
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

        {notice && (
          <p className="rounded-xl bg-gold-100 px-4 py-3 text-center text-sm text-gold-700">
            Sign-in isn’t connected yet — this is a preview. Accounts go live when
            we add the backend.
          </p>
        )}
      </form>

      <AuthSwitch text="New to Kalyanam?" linkText="Create an account" href="/signup" />
    </div>
  );
}
