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
 * A handler receives the tag name and the text lines of the blockquote
 * (line 0 is `[!TAG]`, line 1 is the optional title, remaining lines are body)
 * along with the original React children, and returns a React element.
 */
export type BlockquoteTagHandler = (
  tag: string,
  lines: string[],
  children: React.ReactNode,
) => React.ReactElement;

// ─── React children helpers ───────────────────────────────────────────────────

/** Recursively extracts plain text content from a React node tree. */
export function extractText(node: React.ReactNode): string {
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
export function extractImageSrcs(node: React.ReactNode): string[] {
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

// ─── Built-in handlers ────────────────────────────────────────────────────────

const imageGalleryHandler: BlockquoteTagHandler = (_tag, _lines, children) => {
  const srcs = extractImageSrcs(children);
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

const calloutHandler: BlockquoteTagHandler = (tag, lines, children) => {
  const variant = CALLOUT_VARIANTS[tag] ?? "info";
  const title = lines[1]?.trim();
  return (
    <Callout variant={variant} title={title || undefined}>
      {children}
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

/**
 * Attempts to render a tagged blockquote (`> [!TAG]`) as a JSX component
 * by looking up the tag in `BLOCKQUOTE_HANDLERS`.
 *
 * Returns `null` if the blockquote does not start with a recognised `[!TAG]`,
 * allowing the caller to fall back to default blockquote rendering.
 */
export function renderTaggedBlockquote(
  children: React.ReactNode,
): React.ReactElement | null {
  const text = extractText(children).trim();
  const lines = text.split(/\n/);
  const tagMatch = lines[0]?.match(/^\[!([A-Z_]+)\]$/);
  if (!tagMatch) return null;

  const tag = tagMatch[1];
  const handler = BLOCKQUOTE_HANDLERS[tag];
  if (!handler) return null;

  return handler(tag, lines, children);
}
