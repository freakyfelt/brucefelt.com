import React from "react";
import { describe, it, expect, vi } from "vitest";
import * as runtime from "react/jsx-runtime";
import { evaluateSync } from "@mdx-js/mdx";
import { render, screen } from "@testing-library/react";
import { BLOCKQUOTE_HANDLERS } from "./blockquote-handlers";
import { parseTaggedBlockquote } from "@/lib/utils/mdx/blockquote-renderer";

vi.mock("@/components/common/Callout", () => ({
  Callout: ({
    variant,
    title,
    children,
  }: {
    variant: string;
    title?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <div data-testid="callout" data-variant={variant}>
      {title && <div data-testid="callout-title">{title}</div>}
      <div data-testid="callout-body">{children}</div>
    </div>
  ),
}));

vi.mock("@/components/images/ImageCarousel", () => ({
  ImageCarousel: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="image-carousel">{children}</div>
  ),
  ImageCarouselItem: ({ assetId }: { assetId: string }) => (
    <div data-testid="image-carousel-item" data-asset-id={assetId} />
  ),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Evaluates MDX content and renders it with a custom blockquote component
 * that calls `renderTaggedBlockquote`. Returns the rendered container.
 */
function renderMdx(content: string) {
  const trimmed = content
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  const { default: MDXContent } = evaluateSync(trimmed, {
    ...runtime,
    development: false,
  });

  const { container } = render(
    <MDXContent
      components={{
        blockquote: ({ children }: { children?: React.ReactNode }) => {
          const result = parseTaggedBlockquote({
            children,
            handlers: BLOCKQUOTE_HANDLERS,
          });
          if (result) return result;
          return <blockquote>{children}</blockquote>;
        },
      }}
    />,
  );

  return container;
}

describe("handleBlockquoteTags", () => {
  it("returns null for untagged blockquotes (falls back to <blockquote>)", () => {
    renderMdx("> Regular blockquote content.");
    expect(screen.queryByTestId("callout")).toBeNull();
    expect(screen.getByRole("blockquote")).toBeTruthy();
  });

  it("returns null for blockquotes with unknown tags", () => {
    renderMdx(`
      > [!UNKNOWN]
      >
      > Some content.
    `);
    expect(screen.queryByTestId("callout")).toBeNull();
  });

  describe("[!INFO] — single paragraph (no title)", () => {
    it("renders a Callout with info variant and no title", () => {
      renderMdx(`
        > [!INFO]
        >
        > Just a body paragraph.
      `);
      expect(screen.getByTestId("callout")).toHaveAttribute(
        "data-variant",
        "info",
      );
      expect(screen.queryByTestId("callout-title")).toBeNull();
      expect(screen.getByTestId("callout-body")).toHaveTextContent(
        "Just a body paragraph.",
      );
    });
  });

  describe("[!INFO] — multiple paragraphs (title + body)", () => {
    it("uses the first paragraph as title and the rest as body", () => {
      renderMdx(`
        > [!INFO]
        > Important Title
        >
        > This is the body.
      `);
      expect(screen.getByTestId("callout")).toHaveAttribute(
        "data-variant",
        "info",
      );
      expect(screen.getByTestId("callout-title")).toHaveTextContent(
        "Important Title",
      );
      expect(screen.getByTestId("callout-body")).toHaveTextContent(
        "This is the body.",
      );
    });
  });

  describe("[!WARNING]", () => {
    it("renders a Callout with warning variant", () => {
      renderMdx(`
        > [!WARNING]
        >
        > Be careful.
      `);
      expect(screen.getByTestId("callout")).toHaveAttribute(
        "data-variant",
        "warning",
      );
    });
  });

  describe("[!SUCCESS]", () => {
    it("renders a Callout with success variant", () => {
      renderMdx(`
        > [!SUCCESS]
        >
        > All good.
      `);
      expect(screen.getByTestId("callout")).toHaveAttribute(
        "data-variant",
        "success",
      );
    });
  });

  describe("[!ERROR]", () => {
    it("renders a Callout with error variant", () => {
      renderMdx(`
        > [!ERROR]
        >
        > Something went wrong.
      `);
      expect(screen.getByTestId("callout")).toHaveAttribute(
        "data-variant",
        "error",
      );
    });
  });

  describe("[!IMAGE_GALLERY]", () => {
    it("renders an ImageCarousel with ImageCarouselItems for each Contentful asset", () => {
      renderMdx(`
        > [!IMAGE_GALLERY]
        >
        > ![img1](//images.ctfassets.net/space/id1/v1/img1.webp)
        > ![img2](//images.ctfassets.net/space/id2/v1/img2.webp)
      `);
      expect(screen.getByTestId("image-carousel")).toBeTruthy();
      const items = screen.getAllByTestId("image-carousel-item");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-asset-id", "id1");
      expect(items[1]).toHaveAttribute("data-asset-id", "id2");
    });
  });
});
