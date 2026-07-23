import { Fragment, type ReactNode } from "react";

/**
 * Tiny, dependency-free markdown renderer for the AI advisor's replies.
 *
 * Gemini returns light markdown — **bold**, *italic*, `code`, numbered/bulleted
 * lists and blank-line paragraphs. The chat used to print the raw string, so
 * "**$500**" showed literally. This converts that subset to React nodes.
 *
 * SAFETY: this never uses dangerouslySetInnerHTML — every piece is a plain
 * string or a React element, so there is no HTML-injection surface even though
 * the text comes from a model. Anything it doesn't recognise renders as text.
 */

// ── inline: **bold**, *italic*, `code` ──────────────────────────────────────
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Match the three inline spans; order matters (bold before italic).
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-i${i++}`;
    if (m[2] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {m[2]}
        </strong>,
      );
    } else if (m[3] !== undefined) {
      nodes.push(<em key={key}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-cream-deep px-1 py-0.5 font-mono text-[0.85em]"
        >
          {m[4]}
        </code>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

/**
 * Group lines into paragraph / ordered-list / unordered-list blocks.
 * A blank line ends the current paragraph.
 */
export function renderMarkdown(text: string): ReactNode {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    const prev = blocks[blocks.length - 1];

    if (ol) {
      if (prev?.type === "ol") prev.items.push(ol[1]);
      else blocks.push({ type: "ol", items: [ol[1]] });
    } else if (ul) {
      if (prev?.type === "ul") prev.items.push(ul[1]);
      else blocks.push({ type: "ul", items: [ul[1]] });
    } else if (line.trim() === "") {
      // blank line → break the current paragraph
      if (prev?.type === "p") blocks.push({ type: "p", lines: [] });
    } else {
      if (prev?.type === "p") prev.lines.push(line);
      else blocks.push({ type: "p", lines: [line] });
    }
  }

  return (
    <>
      {blocks.map((b, bi) => {
        if (b.type === "ol") {
          return (
            <ol key={bi} className="my-2 list-decimal space-y-1 pl-5">
              {b.items.map((it, ii) => (
                <li key={ii}>{renderInline(it, `${bi}-${ii}`)}</li>
              ))}
            </ol>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={bi} className="my-2 list-disc space-y-1 pl-5">
              {b.items.map((it, ii) => (
                <li key={ii}>{renderInline(it, `${bi}-${ii}`)}</li>
              ))}
            </ul>
          );
        }
        if (b.lines.length === 0) return null; // empty paragraph separator
        return (
          <p key={bi} className="mb-2 last:mb-0">
            {b.lines.map((ln, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(ln, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
