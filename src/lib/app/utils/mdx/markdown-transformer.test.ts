import { describe, it, expect } from "vitest";
import { transformMarkdownContent } from "./markdown-transformer";

describe("transformMarkdownContent", () => {
  it("should transform [!IMAGE_GALLERY] block into ImageCarousel component with ImageCarouselItem children", () => {
    const content = `
## Gallery Test

> [!IMAGE_GALLERY]
>
> ![Image 1](//images.ctfassets.net/space/id1/v1/img1.webp)
> ![Image 2](//images.ctfassets.net/space/id2/v1/img2.webp)

Some other text.
`;

    const { transformedContent, assetIds } = transformMarkdownContent(content);

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

    const { transformedContent, assetIds } = transformMarkdownContent(content);

    expect(assetIds).toEqual(["id1", "id2"]);
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id1" />');
    expect(transformedContent).toContain('<ImageCarouselItem assetId="id2" />');
  });

  it("should return empty assetIds if no gallery is present", () => {
    const content = "## No Gallery Here";
    const { transformedContent, assetIds } = transformMarkdownContent(content);

    expect(assetIds).toEqual([]);
    expect(transformedContent).toBe(content);
  });

  it("should transform [!INFO] block into Callout component", () => {
    const content = `
> [!INFO]
> Important Title
> This is the body of the callout.
`;

    const { transformedContent } = transformMarkdownContent(content);

    expect(transformedContent).toContain(
      '<Callout variant="info" title="Important Title">',
    );
    expect(transformedContent).toContain("This is the body of the callout.");
    expect(transformedContent).toContain("</Callout>");
  });

  it("should transform [!WARNING] block into Callout component", () => {
    const content = `
> [!WARNING]
> Warning Title
> This is a warning.
`;

    const { transformedContent } = transformMarkdownContent(content);

    expect(transformedContent).toContain(
      '<Callout variant="warning" title="Warning Title">',
    );
    expect(transformedContent).toContain("This is a warning.");
  });

  it("should transform [!ERROR] block into Callout component with error variant", () => {
    const content = `
> [!ERROR]
> Error Title
> This is an error.
`;

    const { transformedContent } = transformMarkdownContent(content);

    expect(transformedContent).toContain(
      '<Callout variant="error" title="Error Title">',
    );
    expect(transformedContent).toContain("This is an error.");
  });

  it("should transform [!SUCCESS] block into Callout component with success variant", () => {
    const content = `
> [!SUCCESS]
> Success Title
> This is a success.
`;

    const { transformedContent } = transformMarkdownContent(content);

    expect(transformedContent).toContain(
      '<Callout variant="success" title="Success Title">',
    );
    expect(transformedContent).toContain("This is a success.");
  });
});
