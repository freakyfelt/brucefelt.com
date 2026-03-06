import React from "react";

/**
 * A handler receives the tag name and the sibling React children that follow
 * the `[!TAG]` element, and returns a React element.
 */
export type BlockquoteTagHandler = (
  tag: string,
  children: React.ReactNode[],
) => React.ReactElement;

// ─── React children helpers ───────────────────────────────────────────────────

/** Recursively extracts plain text content from a React node tree. */
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

/** Normalises React children to a flat array, filtering whitespace-only strings. */
function toChildArray(node: React.ReactNode): React.ReactNode[] {
  if (!node) return [];
  if (Array.isArray(node))
    return node.filter(
      (c) =>
        c !== null &&
        c !== undefined &&
        c !== false &&
        !(typeof c === "string" && c.trim() === ""),
    );
  return [node];
}

// ─── Main renderer ────────────────────────────────────────────────────────────

const TAG_LINE_RE = /^\[!([A-Z_]+)\](?:\n([\s\S]*))?$/;

type TaggedBlockquoteProps = {
  children: React.ReactNode;
  handlers: Record<string, BlockquoteTagHandler>;
  strict?: boolean;
};

/**
 * Attempts to render a tagged blockquote (`> [!TAG]`) as a JSX component
 * by looking up the tag in `handlers`.
 *
 * Normalises children to an array, checks whether the first element starts
 * with a `[!TAG]` marker, then passes the remaining siblings to the handler.
 * If the first element contains additional text after the tag line (e.g. a
 * title on the next line), that text is prepended to the siblings array.
 *
 * Returns `null` if the blockquote does not start with a recognised `[!TAG]`,
 * allowing the caller to fall back to default blockquote rendering.
 */
export function parseTaggedBlockquote({
  children,
  handlers,
  strict = false,
}: TaggedBlockquoteProps) {
  const nodes = toChildArray(children);
  if (nodes.length === 0) return null;

  const [first, ...rest] = nodes;
  const firstText = extractText(first).trim();
  const tagMatch = firstText.match(TAG_LINE_RE);
  if (!tagMatch) return null;

  const tag = tagMatch[1];
  const handler = handlers[tag];
  if (!handler) {
    if (strict) throw new Error(`Unknown blockquote tag: ${tag}`);
    return null;
  }

  // If the first element contained extra text after the tag line (e.g. a title
  // on the next `>` line without a blank separator), pass that text as the
  // first sibling so handlers treat it as the title paragraph.
  const afterTag = tagMatch[2]?.trim();
  const siblings: React.ReactNode[] = afterTag ? [afterTag, ...rest] : rest;

  return handler(tag, siblings);
}
