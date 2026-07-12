"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EnquiryMessage } from "@/lib/db/enquiry-chat";

/**
 * A two-way message thread on an enquiry, shared by the couple and vendor
 * views. `me` says which side is viewing (so bubbles align). `onSend` is the
 * role-appropriate server action; `loadMessages` fetches the thread on open.
 */
export function EnquiryThread({
  me,
  initialMessages,
  onSend,
}: {
  me: "couple" | "vendor";
  initialMessages: EnquiryMessage[];
  onSend: (body: string) => Promise<EnquiryMessage | null>;
}) {
  const [messages, setMessages] = useState<EnquiryMessage[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setBody("");
    // Optimistic bubble.
    const temp: EnquiryMessage = {
      id: `temp-${messages.length}`,
      sender: me,
      body: text,
      createdAt: "",
    };
    setMessages((m) => [...m, temp]);
    const saved = await onSend(text);
    setSending(false);
    setMessages((m) =>
      saved ? m.map((x) => (x.id === temp.id ? saved : x)) : m.filter((x) => x.id !== temp.id),
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-cream-deep/30 p-4">
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink-faint">
            No messages yet. Say hello — ask about pricing, availability, or
            share your details.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.sender === me ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
                  m.sender === me
                    ? "bg-forest-700 text-cream"
                    : "bg-ivory text-ink",
                )}
              >
                {m.body}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          disabled={sending}
          className="h-11 flex-1 rounded-xl border border-border-strong bg-ivory px-4 text-sm text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500 disabled:opacity-60"
        />
        <Button type="submit" variant="primary" size="md" loading={sending}>
          <Send className="h-4 w-4" /> Send
        </Button>
      </form>
    </div>
  );
}
