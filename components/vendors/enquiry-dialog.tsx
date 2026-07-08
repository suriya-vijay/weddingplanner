"use client";

import { useState } from "react";
import { X, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendEnquiryAction } from "@/app/(marketing)/vendors/actions";

/**
 * Couple → vendor enquiry. If the viewer is a signed-in couple, the "Enquire
 * now" button opens a form that saves a real lead (appears in the vendor's
 * Enquiries inbox). Otherwise it routes to login (return here after).
 */
export function EnquiryButton({
  vendorId,
  vendorName,
  canEnquire,
  loginHref,
  className,
}: {
  vendorId: string;
  vendorName: string;
  canEnquire: boolean;
  loginHref: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!canEnquire) {
    return (
      <Button href={loginHref} variant="primary" size="lg" className={className}>
        Enquire now
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className={className}
        onClick={() => setOpen(true)}
      >
        Enquire now
      </Button>
      {open && (
        <EnquiryDialog
          vendorId={vendorId}
          vendorName={vendorName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function EnquiryDialog({
  vendorId,
  vendorName,
  onClose,
}: {
  vendorId: string;
  vendorName: string;
  onClose: () => void;
}) {
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [functions, setFunctions] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await sendEnquiryAction({
      vendorId,
      eventDate,
      city,
      functions,
      budget,
      message,
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? "Couldn't send — please try again.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-900/45" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Enquire with ${vendorName}`}
        className="relative w-full max-w-lg rounded-3xl bg-ivory p-6 shadow-[var(--shadow-lg)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink">Enquire with {vendorName}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="mt-8 flex flex-col items-center gap-4 py-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
              <Check className="h-6 w-6" />
            </span>
            <p className="text-ink">
              Your enquiry was sent to <strong>{vendorName}</strong>. They&apos;ll
              see it in their inbox and get back to you.
            </p>
            <Button variant="primary" size="md" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event date">
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </Field>
              <Field label="City">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Udaipur"
                />
              </Field>
              <Field label="Functions">
                <Input
                  value={functions}
                  onChange={(e) => setFunctions(e.target.value)}
                  placeholder="e.g. Mehendi, Sangeet, Wedding"
                />
              </Field>
              <Field label="Budget">
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹5–8 lakh"
                />
              </Field>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Tell them about your celebration…"
                className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-[0.95rem] text-ink transition-colors focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="md" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" loading={sending}>
                <Send className="h-4 w-4" /> Send enquiry
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
