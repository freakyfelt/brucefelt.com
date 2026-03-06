import { extractContentfulAssetIdFromSrc } from "@/lib/app/utils/asset-scanner";
import type { BlockquoteTagHandler } from "@/lib/utils/mdx/blockquote-renderer";
import React from "react";
import { ImageCarousel, ImageCarouselItem } from "../images/ImageCarousel";
import { Callout } from "../common/Callout";

type CalloutVariant = "info" | "success" | "warning" | "error";

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
