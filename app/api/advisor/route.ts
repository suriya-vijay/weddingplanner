import { createClient } from "@/lib/supabase/server";
import { buildAdvisorSystemPrompt } from "@/lib/ai/system-prompt";
import { streamAdvisorReply, AiBusyError, type AdvisorTurn } from "@/lib/ai/gemini";
import {
  getOrCreateConversation,
  getMessages,
  addMessage,
} from "@/lib/db/advisor";

// The Gemini SDK targets Node, and the key must stay server-side.
export const runtime = "nodejs";

// Simple per-user rate limit (in-memory; fine for a single-instance demo).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;
const hits = new Map<string, number[]>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(userId, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  if (rateLimited(user.id))
    return new Response("Too many messages — please wait a moment.", {
      status: 429,
    });

  let message = "";
  try {
    ({ message } = await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (typeof message !== "string" || !message.trim())
    return new Response("Empty message", { status: 400 });

  const systemInstruction = await buildAdvisorSystemPrompt();
  if (!systemInstruction)
    return new Response("No wedding found for this account", { status: 400 });

  const conversationId = await getOrCreateConversation();
  if (!conversationId)
    return new Response("Could not start a conversation", { status: 500 });

  // Persist the user's message, then build the model context from history.
  await addMessage(conversationId, "user", message.trim());
  const history = await getMessages(conversationId);
  const contents: AdvisorTurn[] = history.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  let stream: AsyncGenerator<string>;
  try {
    stream = await streamAdvisorReply({ systemInstruction, contents });
  } catch (err) {
    // A busy upstream (free-tier 503) is temporary — say so honestly and with
    // the right status, rather than a generic "unavailable" 500.
    if (err instanceof AiBusyError)
      return new Response(err.message, { status: 503 });
    const msg =
      err instanceof Error && /GEMINI_API_KEY/.test(err.message)
        ? "The AI advisor isn't configured yet (missing GEMINI_API_KEY)."
        : "The AI advisor is unavailable right now.";
    return new Response(msg, { status: 500 });
  }

  const encoder = new TextEncoder();
  let full = "";

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const piece of stream) {
          full += piece;
          controller.enqueue(encoder.encode(piece));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[The reply was interrupted.]"));
      } finally {
        // Persist the assembled assistant reply (best-effort).
        if (full.trim()) await addMessage(conversationId, "model", full);
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
