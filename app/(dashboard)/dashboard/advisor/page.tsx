import type { Metadata } from "next";
import { AdvisorChat } from "@/components/dashboard/advisor-chat";
import { getOrCreateConversation, getMessages } from "@/lib/db/advisor";

export const metadata: Metadata = {
  title: "AI Advisor · Kalyanam & Co.",
};

export default async function AdvisorPage() {
  const conversationId = await getOrCreateConversation();
  const initialMessages = conversationId
    ? await getMessages(conversationId)
    : [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <header className="mb-4">
        <p className="eyebrow text-gold-600">Wedding planning</p>
        <h1 className="mt-2 font-serif text-h1 text-ink">
          AI Advisor
        </h1>
        <p className="mt-1 text-ink-soft">
          Ask anything about planning your wedding — grounded in your budget,
          guest list, and checklist.
        </p>
      </header>

      <AdvisorChat
        initialMessages={initialMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))}
      />
    </div>
  );
}
