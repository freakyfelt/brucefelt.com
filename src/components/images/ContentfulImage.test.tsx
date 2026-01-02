import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentfulImage } from "./ContentfulImage";
import { Asset } from "@/interfaces/asset";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

// Mock getImageById
vi.mock("@/lib/data/assets", () => ({
  getImageById: vi.fn(),
}));

describe("ContentfulImage", () => {
  const mockAsset: Asset = {
    slug: "test-id",
    title: "Test Title",
    description: "Test Description",
    contentType: "image/webp",
    width: 1000,
    height: 500,
    medium: "//images.ctfassets.net/space/test-id/v1/medium.webp",
    large: "//images.ctfassets.net/space/test-id/v1/large.webp",
  };

  it("should render an image with the correct src and alt when asset is provided", async () => {
    const Result = await ContentfulImage({ asset: mockAsset });
    render(Result);

    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe(
      "https://images.ctfassets.net/space/test-id/v1/large.webp",
    );
    expect(img.getAttribute("alt")).toBe("Test Title");
  });

  it("should use description as alt if title is missing", async () => {
    const assetWithoutTitle = { ...mockAsset, title: "" };
    const Result = await ContentfulImage({ asset: assetWithoutTitle });
    render(Result);

    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe("Test Description");
  });

  it("should apply custom className", async () => {
    const Result = await ContentfulImage({
      asset: mockAsset,
      className: "custom-class",
    });
    render(Result);

    const img = screen.getByRole("img");
    expect(img.className).toContain("custom-class");
  });
});
