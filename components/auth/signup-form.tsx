"use client";

import { useState } from "react";
import { Eye, EyeOff, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AuthField,
  GoogleButton,
  AuthDivider,
  AuthSwitch,
} from "./auth-shell";

type Account = "couple" | "vendor";

/**
 * Sign-up form — UI only this phase. Couple / Vendor toggle adapts the name
 * label. Lightweight plain-React validation; real auth wired later.
 */
export function SignupForm() {
  const [account, setAccount] = useState<Account>("couple");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (password.length < 8)
      next.password = "Use at least 8 characters.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(false);
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setNotice(true);
    }, 700);
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">
          Begin your journey
        </h1>
        <p className="mt-2 text-ink-soft">
          Create your account in moments — no payment required.
        </p>
      </div>

      {/* Account-type toggle */}
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid grid-cols-2 gap-2 rounded-2xl bg-cream-deep/60 p-1.5"
      >
        <AccountOption
          active={account === "couple"}
          onClick={() => setAccount("couple")}
          icon={<Heart className="h-4 w-4" />}
          label="I'm a couple"
        />
        <AccountOption
          active={account === "vendor"}
          onClick={() => setAccount("vendor")}
          icon={<Store className="h-4 w-4" />}
          label="I'm a vendor"
        />
      </div>

      <GoogleButton
        label="Sign up with Google"
        onClick={() => setNotice(true)}
      />
      <AuthDivider label="or sign up with email" />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          label={account === "vendor" ? "Business name" : "Full name"}
          htmlFor="name"
          error={errors.name}
        >
          <Input
            id="name"
            autoComplete={account === "vendor" ? "organization" : "name"}
            placeholder={account === "vendor" ? "e.g. Mandap Studio" : "e.g. Aanya Mehra"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
        </AuthField>

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

        <AuthField label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

        <div className="space-y-1.5">
          <label className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-forest-700"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-forest-700 underline-offset-2 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-forest-700 underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agree && (
            <p role="alert" className="text-sm text-destructive">
              {errors.agree}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          Create Account
        </Button>

        {notice && (
          <p className="rounded-xl bg-gold-100 px-4 py-3 text-center text-sm text-gold-700">
            Accounts aren’t live yet — this is a preview. Sign-up will work once
            we connect the backend.
          </p>
        )}
      </form>

      <AuthSwitch text="Already have an account?" linkText="Log in" href="/login" />
    </div>
  );
}

function AccountOption({
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
