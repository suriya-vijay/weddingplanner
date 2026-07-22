import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { MessagesInbox } from "@/components/admin/messages-inbox";
import { getContactSubmissions } from "@/lib/db/contact";

export const metadata: Metadata = { title: "Messages · Admin" };

/**
 * Contact-form inbox. Before 0012 these submissions were discarded by a fake
 * setTimeout, so this is where they now land.
 */
export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Messages
        </h1>
        <p className="mt-1 text-ink-soft">
          Everything sent through the contact form.
        </p>
      </header>

      {submissions.length === 0 ? (
        <EmptyState icon={<Mail className="h-6 w-6" />} title="No messages yet">
          Submissions from the contact page arrive here — couples, vendors and
          press.
        </EmptyState>
      ) : (
        <MessagesInbox initial={submissions} />
      )}
    </div>
  );
}
