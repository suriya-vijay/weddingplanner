import { GoogleGenAI, Type } from "@google/genai";

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

// Stable, chat-suited, free-tier eligible. Avoid Gemini Pro (no free tier).
export const ADVISOR_MODEL = "gemini-flash-latest";

/**
 * ⚠️ THINKING BUDGET — do not remove.
 * gemini-2.5-flash class models are *thinking* models: internal reasoning is
 * billed against `maxOutputTokens`. With the old 1024 cap the model spent ~981
 * tokens thinking and left ~29 for the answer → finishReason MAX_TOKENS → empty
 * / truncated output. (That silently broke the AI timeline 100% of the time.)
 * We disable thinking for these short, structured tasks and keep a roomy cap.
 */
const THINKING_OFF = { thinkingBudget: 0 } as const;
const MAX_TOKENS = 2048;

/** True for transient upstream failures worth one retry (503 / overloaded). */
function isTransient(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(503|UNAVAILABLE|overloaded|high demand)\b/i.test(msg);
}

/** Reject if `p` hasn't settled within `ms` — the free tier can hang. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error("503 UNAVAILABLE: request timed out")), ms),
    ),
  ]);
}

/**
 * Run `fn` with a timeout, retrying once on a transient upstream error. The
 * free tier returns 503 "high demand" in bursts and can hang outright, so a
 * bounded attempt + one retry keeps the UI honest instead of spinning forever.
 */
async function withRetry<T>(fn: () => Promise<T>, ms = 45_000): Promise<T> {
  try {
    return await withTimeout(fn(), ms);
  } catch (err) {
    if (!isTransient(err)) throw err;
    await new Promise((r) => setTimeout(r, 1200));
    return withTimeout(fn(), ms);
  }
}

/**
 * Recover whole `{...}` objects from a malformed/truncated JSON array by
 * scanning balanced braces (ignoring braces inside strings). Returns only the
 * items that parse — a partial timeline beats no timeline.
 */
function salvageObjects(text: string): unknown[] {
  const out: unknown[] = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        try {
          out.push(JSON.parse(text.slice(start, i + 1)));
        } catch {
          /* skip an unrecoverable object */
        }
        start = -1;
      }
    }
  }
  return out;
}

/** Thrown when the model is temporarily overloaded (free-tier 503). */
export class AiBusyError extends Error {
  constructor() {
    super("The AI is busy right now — please try again in a moment.");
    this.name = "AiBusyError";
  }
}

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
  const result = await withRetry(() =>
    ai.models.generateContentStream({
      model: ADVISOR_MODEL,
      contents: opts.contents,
      config: {
        systemInstruction: opts.systemInstruction,
        temperature: 0.7,
        // Thinking off + roomy cap: otherwise reasoning eats the token budget
        // and replies truncate mid-sentence (see THINKING_OFF above).
        thinkingConfig: THINKING_OFF,
        maxOutputTokens: MAX_TOKENS,
      },
    }),
  ).catch((err) => {
    if (isTransient(err)) throw new AiBusyError();
    throw err;
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
  const res = await withRetry(() =>
    ai.models.generateContent({
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
        // A response SCHEMA (not just JSON mime) constrains decoding so the
        // model can't emit a malformed/unterminated array — observed in the
        // wild even with JSON mime alone.
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              detail: { type: Type.STRING },
            },
            required: ["title", "detail"],
          },
        },
        temperature: 0.6,
        // Thinking off + roomy cap — see THINKING_OFF. Without this the model
        // burns the whole budget reasoning and returns nothing parseable.
        thinkingConfig: THINKING_OFF,
        maxOutputTokens: MAX_TOKENS,
      },
    }),
  ).catch((err) => {
    if (isTransient(err)) throw new AiBusyError();
    throw err;
  });

  const finish = res.candidates?.[0]?.finishReason;
  const text = res.text ?? "";
  if (!text) {
    // Never fail silently again: log why (finishReason is the tell).
    console.error("[ai] timeline: empty response", { finish });
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Rare: a malformed/truncated array slips through. Salvage the complete
    // objects rather than showing the couple "no milestones".
    parsed = salvageObjects(text);
    console.error("[ai] timeline: unparseable JSON — salvaged", {
      finish,
      salvaged: (parsed as unknown[]).length,
      sample: text.slice(0, 200),
    });
  }
  if (!Array.isArray(parsed)) {
    console.error("[ai] timeline: not an array", { finish });
    return [];
  }
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
