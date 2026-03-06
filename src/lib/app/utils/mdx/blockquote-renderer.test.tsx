import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  extractText,
  extractImageSrcs,
  renderTaggedBlockquote,
} from "./blockquote-renderer";

// ─── Mock heavy components ────────────────────────────────────────────────────

vi.mock("@/components/common/Callout", () => ({
  Callout: ({
    variant,
    title,
    children,
  }: {
    variant: string;
    title?: string;
    children?: React.ReactNode;
  }) => (
    <div data-testid="callout" data-variant={variant} data-title={title}>
      {children}
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

// ─── extractText ──────────────────────────────────────────────────────────────

describe("extractText", () => {
  it("returns string nodes as-is", () => {
    expect(extractText("hello")).toBe("hello");
  });

  it("converts number nodes to string", () => {
    expect(extractText(42)).toBe("42");
  });

  it("returns empty string for null/undefined", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(undefined)).toBe("");
  });

  it("joins array nodes", () => {
    expect(extractText(["hello", " ", "world"])).toBe("hello world");
  });

  it("extracts text from React elements recursively", () => {
    const node = (
      <p>
        Hello <strong>world</strong>
      </p>
    );
    expect(extractText(node)).toBe("Hello world");
  });
});

// ─── extractImageSrcs ─────────────────────────────────────────────────────────

describe("extractImageSrcs", () => {
  it("returns empty array for null", () => {
    expect(extractImageSrcs(null)).toEqual([]);
  });

  it("extracts src from a single img element", () => {
    const node = <img src="https://example.com/img.png" alt="test" />;
    expect(extractImageSrcs(node)).toEqual(["https://example.com/img.png"]);
  });

  it("extracts srcs from nested elements", () => {
    const node = (
      <div>
        <img src="//images.ctfassets.net/s/id1/v/img1.webp" alt="1" />
        <img src="//images.ctfassets.net/s/id2/v/img2.webp" alt="2" />
      </div>
    );
    expect(extractImageSrcs(node)).toEqual([
      "//images.ctfassets.net/s/id1/v/img1.webp",
      "//images.ctfassets.net/s/id2/v/img2.webp",
    ]);
  });
});

// ─── renderTaggedBlockquote ───────────────────────────────────────────────────

describe("renderTaggedBlockquote", () => {
  it("returns null for untagged blockquotes", () => {
    const children = <p>Regular blockquote content.</p>;
    expect(renderTaggedBlockquote(children)).toBeNull();
  });

  it("returns null for blockquotes with unknown tags", () => {
    const children = "[!UNKNOWN_TAG]\nSome content.";
    expect(renderTaggedBlockquote(children)).toBeNull();
  });

  describe("[!INFO]", () => {
    it("renders a Callout with info variant", () => {
      const children = "[!INFO]\nImportant Title\nThis is the body.";
      const result = renderTaggedBlockquote(children);
      expect(result).not.toBeNull();
      const { getByTestId } = render(result!);
      const callout = getByTestId("callout");
      expect(callout).toHaveAttribute("data-variant", "info");
      expect(callout).toHaveAttribute("data-title", "Important Title");
      expect(callout.textContent).toContain("This is the body.");
    });
  });

  describe("[!SUCCESS]", () => {
    it("renders a Callout with success variant", () => {
      const children = "[!SUCCESS]\nSuccess Title\nAll good.";
      const result = renderTaggedBlockquote(children);
      const { getByTestId } = render(result!);
      expect(getByTestId("callout")).toHaveAttribute("data-variant", "success");
    });
  });

  describe("[!WARNING]", () => {
    it("renders a Callout with warning variant", () => {
      const children = "[!WARNING]\nWarning Title\nBe careful.";
      const result = renderTaggedBlockquote(children);
      const { getByTestId } = render(result!);
      expect(getByTestId("callout")).toHaveAttribute("data-variant", "warning");
    });
  });

  describe("[!ERROR]", () => {
    it("renders a Callout with error variant", () => {
      const children = "[!ERROR]\nError Title\nSomething went wrong.";
      const result = renderTaggedBlockquote(children);
      const { getByTestId } = render(result!);
      expect(getByTestId("callout")).toHaveAttribute("data-variant", "error");
    });
  });

  describe("[!IMAGE_GALLERY]", () => {
    it("renders an ImageCarousel with ImageCarouselItems for each Contentful asset", () => {
      const children = (
        <>
          {"[!IMAGE_GALLERY]\n"}
          <img src="//images.ctfassets.net/space/id1/v1/img1.webp" alt="img1" />
          <img src="//images.ctfassets.net/space/id2/v1/img2.webp" alt="img2" />
        </>
      );
      const result = renderTaggedBlockquote(children);
      expect(result).not.toBeNull();
      const { getByTestId, getAllByTestId } = render(result!);
      expect(getByTestId("image-carousel")).toBeTruthy();
      const items = getAllByTestId("image-carousel-item");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-asset-id", "id1");
      expect(items[1]).toHaveAttribute("data-asset-id", "id2");
    });
  });
});
