import { describe, it, expect } from "vitest";
import { transformPostContent } from "./import-posts";

describe("transformPostContent", () => {
  it("should transform [!IMAGE_GALLERY] block into ImageCarousel component with ImageCarouselItem children", () => {
    const content = `
## Gallery Test

> [!IMAGE_GALLERY]
>
> ![Image 1](//images.ctfassets.net/space/id1/v1/img1.webp)
> ![Image 2](//images.ctfassets.net/space/id2/v1/img2.webp)

Some other text.
`;

    const { transformedContent, assetIds } = transformPostContent(content);

    expect(assetIds).toEqual(["id1", "id2"]);
    expect(transformedContent).toContain("<ImageCarousel>");
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id1" />');
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id2" />');
    expect(transformedContent).toContain("</ImageCarousel>");
    expect(transformedContent).not.toContain("> [!IMAGE_GALLERY]");
  });

  it("should handle multiple gallery blocks", () => {
    const content = `
> [!IMAGE_GALLERY]
> ![Img 1](//images.ctfassets.net/s/id1/v/i1.webp)

Middle text.

> [!IMAGE_GALLERY]
> ![Img 2](//images.ctfassets.net/s/id2/v/i2.webp)
`;

    const { transformedContent, assetIds } = transformPostContent(content);

    expect(assetIds).toEqual(["id1", "id2"]);
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id1" />');
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id2" />');
  });

  it("should return empty assetIds if no gallery is present", () => {
    const content = "## No Gallery Here";
    const { transformedContent, assetIds } = transformPostContent(content);

    expect(assetIds).toEqual([]);
    expect(transformedContent).toBe(content);
  });
});
