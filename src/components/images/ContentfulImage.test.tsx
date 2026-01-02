import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentfulImage } from "./ContentfulImage";
import { ImageAsset } from "@/interfaces/image-asset";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
    width,
    height,
  }: {
    src: string;
    alt: string;
    className: string;
    width: number;
    height: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  ),
}));

// Mock getImageById
vi.mock("@/lib/data/assets", () => ({
  getImageById: vi.fn(),
}));

describe("ContentfulImage", () => {
  const mockAsset: ImageAsset = {
    slug: "test-id",
    title: "Test Title",
    description: "Test Description",
    contentType: "image/webp",
    width: 1000,
    height: 500,
    url: "//images.ctfassets.net/space/test-id/v1/image.webp",
  };

  it("should render an image with the correct src and alt when asset is provided", async () => {
    const Result = await ContentfulImage({ asset: mockAsset });
    render(Result);

    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe(
      "https://images.ctfassets.net/space/test-id/v1/image.webp?h=1000&q=75&fm=webp",
    );
    expect(img.getAttribute("alt")).toBe("Test Title");
    expect(img.getAttribute("width")).toBe("2000");
    expect(img.getAttribute("height")).toBe("1000");
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
