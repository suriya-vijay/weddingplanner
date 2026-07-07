import { GoogleGenAI } from "@google/genai";

/**
 * Gemini client boundary (mirrors lib/db / lib/storage). The API route calls
 * these helpers — never the SDK directly — so the model id and provider stay
 * in one place.
 *
 * Provider: Google Gemini via Google AI Studio, FREE tier (key only, no
 * billing). The free tier's terms allow Google to use submitted data to
 * improve their models — hence the visible privacy notice in the advisor UI.
 *
 * ── SWITCH AT LAUNCH ──────────────────────────────────────────────────────
 * Before a real launch, move to a paid Gemini tier / data-governance setup
 * where Google does NOT train on or retain user data, then remove the privacy
 * warning in components/dashboard/advisor-chat.tsx. That is a config change
 * here (tier/model + key), not a rearchitecture.
 */

// Stable, chat-suited, free-tier eligible. `gemini-2.5-flash-lite` has a higher
// daily request cap if needed. Avoid Gemini Pro (no free tier).
export const ADVISOR_MODEL = "gemini-2.5-flash";

export type AdvisorTurn = {
  role: "user" | "model";
  parts: { text: string }[];
};

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

/**
 * Stream an advisor reply. Returns an async iterable of text chunks. Throws if
 * the key is missing (surfaced to the route as a 500/clear error).
 */
export async function streamAdvisorReply(opts: {
  systemInstruction: string;
  contents: AdvisorTurn[];
}): Promise<AsyncGenerator<string>> {
  const ai = new GoogleGenAI({ apiKey: apiKey() });
  const result = await ai.models.generateContentStream({
    model: ADVISOR_MODEL,
    contents: opts.contents,
    config: {
      systemInstruction: opts.systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  async function* chunks(): AsyncGenerator<string> {
    for await (const chunk of result) {
      if (chunk.text) yield chunk.text;
    }
  }
  return chunks();
}
