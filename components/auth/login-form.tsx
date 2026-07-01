"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Heart, Shield, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, type Role } from "@/components/auth/session";
import { cn } from "@/lib/utils";
import {
  AuthField,
  GoogleButton,
  AuthDivider,
  AuthSwitch,
} from "./auth-shell";

/** Which panel each demo role lands on after sign-in. */
const PANEL_FOR: Record<Role, string> = {
  couple: "/dashboard",
  admin: "/admin",
  vendor: "/vendor",
};

/**
 * Login form — UI only this phase (validates, then starts a mock session and
 * routes into the panel for the picked role). Real Supabase auth comes later.
 */
export function LoginForm() {
  const { signIn } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>("couple");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // No backend yet — simulate a brief sign-in, then start a mock session and
    // route into the matching panel.
    setTimeout(() => {
      signIn(role);
      router.push(PANEL_FOR[role]);
    }, 500);
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-ink-soft">
          Sign in to continue planning your celebration.
        </p>
      </div>

      <GoogleButton
        onClick={() => {
          signIn("couple");
          router.push("/dashboard");
        }}
      />
      <AuthDivider label="or sign in with email" />

      {/* Demo-only role picker — pick which panel to enter. Real accounts carry
          their own role from the backend; this is a preview convenience. */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Sign in as (demo)</p>
        <div
          role="radiogroup"
          aria-label="Demo role"
          className="grid grid-cols-3 gap-2 rounded-2xl bg-cream-deep/60 p-1.5"
        >
          <RoleOption
            active={role === "couple"}
            onClick={() => setRole("couple")}
            icon={<Heart className="h-4 w-4" />}
            label="Couple"
          />
          <RoleOption
            active={role === "vendor"}
            onClick={() => setRole("vendor")}
            icon={<Store className="h-4 w-4" />}
            label="Vendor"
          />
          <RoleOption
            active={role === "admin"}
            onClick={() => setRole("admin")}
            icon={<Shield className="h-4 w-4" />}
            label="Admin"
          />
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          Preview only — no real authentication yet.
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
          {role === "admin"
            ? "Enter admin panel"
            : role === "vendor"
              ? "Enter vendor portal"
              : "Sign In"}
        </Button>
      </form>

      <AuthSwitch text="New to Kalyanam?" linkText="Create an account" href="/signup" />
    </div>
  );
}

function RoleOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-[var(--dur-fast)]",
        active
          ? "bg-ivory text-forest-700 shadow-[var(--shadow-sm)]"
          : "text-ink-soft hover:text-forest-700",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
