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
    fill,
    style,
  }: {
    src: string;
    alt: string;
    className: string;
    width?: number;
    height?: number;
    fill?: boolean;
    style?: React.CSSProperties;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      data-fill={fill ? "true" : "false"}
      data-style={style ? JSON.stringify(style) : undefined}
    />
  ),
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

  it("should render an image with the correct src and alt when asset is provided", () => {
    render(<ContentfulImage asset={mockAsset} />);

    const img = screen.getByRole("img");
    // The src prop passed to Image should have the default params
    expect(img.getAttribute("src")).toContain("w=1000");
    expect(img.getAttribute("src")).toContain("q=75");
    expect(img.getAttribute("src")).toContain("fm=webp");
    expect(img.getAttribute("alt")).toBe("Test Title");
    expect(img.getAttribute("width")).toBe("1000");
    expect(img.getAttribute("height")).toBe("500");
  });

  it("should use description as alt if title is missing", () => {
    const assetWithoutTitle = { ...mockAsset, title: "" };
    render(<ContentfulImage asset={assetWithoutTitle} />);

    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe("Test Description");
  });

  it("should apply custom className", () => {
    render(<ContentfulImage asset={mockAsset} className="custom-class" />);

    const img = screen.getByRole("img");
    expect(img.className).toContain("custom-class");
  });

  it("should support fill mode", () => {
    render(<ContentfulImage asset={mockAsset} fill />);

    const img = screen.getByRole("img");
    expect(img.getAttribute("data-fill")).toBe("true");
    expect(img.getAttribute("width")).toBeNull();
    expect(img.getAttribute("height")).toBeNull();

    const style = JSON.parse(img.getAttribute("data-style") || "{}");
    expect(style.objectFit).toBe("contain");
  });

  it("should allow overriding width and height", () => {
    render(<ContentfulImage asset={mockAsset} width={200} height={100} />);

    const img = screen.getByRole("img");
    expect(img.getAttribute("width")).toBe("200");
    expect(img.getAttribute("height")).toBe("100");
  });
});
