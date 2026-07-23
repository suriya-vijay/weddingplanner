"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";

type Msg = { role: "user" | "model"; content: string };

const SUGGESTIONS = [
  "What should I prioritize next?",
  "Help me plan the mehendi ceremony.",
  "Am I on track with my budget?",
];

/**
 * Advisor chat. Streams the reply from /api/advisor (Gemini, server-side key)
 * and appends tokens live. Persistence is server-side; we seed from history.
 * A conditional typing state is the only motion (allowed by the cap).
 */
export function AdvisorChat({ initialMessages }: { initialMessages: Msg[] }) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setBusy(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) {
        setError((await res.text()) || "Something went wrong.");
        setBusy(false);
        return;
      }

      // Start an empty assistant message and stream tokens into it.
      setMessages((m) => [...m, { role: "model", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "model",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setError("Couldn't reach the advisor. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-ivory shadow-[var(--shadow-sm)]">
      {/* Privacy notice — demo uses the free Gemini tier (data may be used by Google). */}
      <div className="flex items-start gap-2 border-b border-gold-200/70 bg-gold-50 px-4 py-2.5 text-xs text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
        <p>
          <strong className="text-ink">Demo AI</strong> — powered by Google
          Gemini (free tier). Please don&apos;t enter real personal or sensitive
          details; messages may be used by Google to improve their models.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-[22rem] flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="max-w-sm text-ink-soft">
              Your wedding advisor is ready. Ask about ceremonies, budgets,
              timelines, or what to tackle next.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border-strong bg-ivory px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-gold-400 hover:text-forest-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed",
                  m.role === "user"
                    ? "whitespace-pre-wrap bg-forest-700 text-cream"
                    : "bg-cream-deep/60 text-ink",
                )}
              >
                {m.role === "user"
                  ? m.content || (busy ? "…" : "")
                  : m.content
                    ? renderMarkdown(m.content)
                    : busy
                      ? "…"
                      : ""}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="mx-4 mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your wedding advisor…"
          disabled={busy}
          className="h-11 flex-1 rounded-xl border border-border-strong bg-ivory px-4 text-[0.95rem] text-ink transition-colors focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500 disabled:opacity-60"
        />
        <Button type="submit" variant="primary" size="md" loading={busy}>
          <Send className="h-4 w-4" /> Send
        </Button>
      </form>
    </div>
  );
}
