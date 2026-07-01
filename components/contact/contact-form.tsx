"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "I'm planning a wedding",
  "I'm a vendor",
  "Press & partnerships",
  "Something else",
] as const;

/**
 * Contact form — UI only this phase. Plain-React validation (mirrors the auth
 * forms); on submit shows a friendly "not sent yet" notice. Real email delivery
 * arrives with the backend.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string>(INTERESTS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (message.trim().length < 10)
      next.message = "A little more detail helps us help you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Your name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="e.g. Aanya Mehra"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field label="Email address" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="I'm reaching out because…" htmlFor="interest">
        <select
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="h-12 w-full rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
        >
          {INTERESTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your celebration…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-faint transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
        />
      </Field>

      <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
        <Send className="h-4 w-4" /> Send message
      </Button>

      {sent && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-center text-sm text-gold-700">
          Thank you — we’ve got your note. (Preview only: messages aren’t
          delivered yet; email goes live with the backend.)
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className={cn("mt-1.5 text-sm text-destructive")}>
          {error}
        </p>
      )}
    </div>
  );
}
