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

/**
 * Generate a JSON array of wedding-timeline milestones tuned to the couple's
 * context. Non-streaming, JSON-mode for reliable parsing. Throws if the key is
 * missing (caller falls back to a static template).
 */
export async function generateTimelineMilestones(
  context: string,
): Promise<{ title: string; detail: string; date: string; status: string }[]> {
  const ai = new GoogleGenAI({ apiKey: apiKey() });
  const res = await ai.models.generateContent({
    model: ADVISOR_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Create a wedding-planning timeline of 6–8 milestones for this couple. " +
              "Return ONLY a JSON array; each item is {\"title\": string, \"detail\": string (one short sentence), \"date\": \"\" }. " +
              "Order from earliest to latest planning stage. Leave date as an empty string (the couple sets real dates). " +
              "Make it culturally appropriate for an Indian wedding.\n\n" +
              context,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.6,
      maxOutputTokens: 1024,
    },
  });

  const text = res.text ?? "[]";
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (m): m is { title: string; detail?: string } =>
        !!m && typeof (m as { title?: unknown }).title === "string",
    )
    .map((m) => ({
      title: String(m.title),
      detail: typeof m.detail === "string" ? m.detail : "",
      date: "",
      status: "upcoming",
    }));
}
