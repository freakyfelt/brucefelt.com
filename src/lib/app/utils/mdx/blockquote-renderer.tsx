import React from "react";
import { Callout } from "@/components/common/Callout";
import {
  ImageCarousel,
  ImageCarouselItem,
} from "@/components/images/ImageCarousel";
import { extractContentfulAssetIdFromSrc } from "@/lib/app/utils/mdx/asset-scanner";

// ─── Types ────────────────────────────────────────────────────────────────────

type CalloutVariant = "info" | "success" | "warning" | "error";

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

/** Recursively collects `src` attributes from all <img> nodes in a React tree. */
function extractImageSrcs(node: React.ReactNode): string[] {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(extractImageSrcs);
  if (React.isValidElement(node)) {
    const { src, children } = node.props as {
      src?: string;
      children?: React.ReactNode;
    };
    const childSrcs = extractImageSrcs(children);
    return src ? [src, ...childSrcs] : childSrcs;
  }
  return [];
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

// ─── Built-in handlers ────────────────────────────────────────────────────────

const imageGalleryHandler: BlockquoteTagHandler = (_tag, siblings) => {
  const srcs = extractImageSrcs(siblings);
  const assetIds = srcs
    .map(extractContentfulAssetIdFromSrc)
    .filter((id): id is string => id !== null);

  return (
    <ImageCarousel>
      {assetIds.map((id) => (
        <ImageCarouselItem key={id} assetId={id} />
      ))}
    </ImageCarousel>
  );
};

const CALLOUT_VARIANTS: Record<string, CalloutVariant> = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

/**
 * Renders a callout from the sibling nodes that follow the `[!TAG]` element.
 *
 * - **Single sibling**: no title; the sibling becomes the body.
 * - **Multiple siblings**: the first sibling becomes the title; the rest
 *   become the body.
 */
const calloutHandler: BlockquoteTagHandler = (tag, siblings) => {
  const variant = CALLOUT_VARIANTS[tag] ?? "info";

  if (siblings.length <= 1) {
    return <Callout variant={variant}>{siblings[0] ?? null}</Callout>;
  }

  const [titleNode, ...bodyNodes] = siblings;
  const body = bodyNodes.length === 1 ? bodyNodes[0] : bodyNodes;

  return (
    <Callout variant={variant} title={titleNode}>
      {body}
    </Callout>
  );
};

// ─── Handler registry ─────────────────────────────────────────────────────────

/**
 * Maps `[!TAG]` names to their handler functions.
 * Add new entries here to support additional blockquote tags.
 */
export const BLOCKQUOTE_HANDLERS: Record<string, BlockquoteTagHandler> = {
  IMAGE_GALLERY: imageGalleryHandler,
  INFO: calloutHandler,
  SUCCESS: calloutHandler,
  WARNING: calloutHandler,
  ERROR: calloutHandler,
};

// ─── Main renderer ────────────────────────────────────────────────────────────

const TAG_LINE_RE = /^\[!([A-Z_]+)\](?:\n([\s\S]*))?$/;

/**
 * Attempts to render a tagged blockquote (`> [!TAG]`) as a JSX component
 * by looking up the tag in `BLOCKQUOTE_HANDLERS`.
 *
 * Normalises children to an array, checks whether the first element starts
 * with a `[!TAG]` marker, then passes the remaining siblings to the handler.
 * If the first element contains additional text after the tag line (e.g. a
 * title on the next line), that text is prepended to the siblings array.
 *
 * Returns `null` if the blockquote does not start with a recognised `[!TAG]`,
 * allowing the caller to fall back to default blockquote rendering.
 */
export function renderTaggedBlockquote(
  children: React.ReactNode,
): React.ReactElement | null {
  const nodes = toChildArray(children);
  if (nodes.length === 0) return null;

  const [first, ...rest] = nodes;
  const firstText = extractText(first).trim();
  const tagMatch = firstText.match(TAG_LINE_RE);
  if (!tagMatch) return null;

  const tag = tagMatch[1];
  const handler = BLOCKQUOTE_HANDLERS[tag];
  if (!handler) return null;

  // If the first element contained extra text after the tag line (e.g. a title
  // on the next `>` line without a blank separator), pass that text as the
  // first sibling so handlers treat it as the title paragraph.
  const afterTag = tagMatch[2]?.trim();
  const siblings: React.ReactNode[] = afterTag ? [afterTag, ...rest] : rest;

  return handler(tag, siblings);
}
