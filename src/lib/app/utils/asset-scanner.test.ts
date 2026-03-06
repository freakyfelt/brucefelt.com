import { describe, it, expect } from "vitest";
import {
  extractContentfulAssetIdFromSrc,
  extractContentfulAssetIds,
} from "./asset-scanner";

describe("extractContentfulAssetIdFromSrc", () => {
  it("extracts asset ID from a Contentful URL", () => {
    expect(
      extractContentfulAssetIdFromSrc(
        "//images.ctfassets.net/space123/assetABC/v1/img.webp",
      ),
    ).toBe("assetABC");
  });

  it("returns null for non-Contentful URLs", () => {
    expect(
      extractContentfulAssetIdFromSrc("https://example.com/img.png"),
    ).toBeNull();
  });
});

describe("extractContentfulAssetIds", () => {
  it("extracts a single asset ID from a Contentful image URL", () => {
    const content =
      "![Image](//images.ctfassets.net/space123/assetABC/v1/img.webp)";
    expect(extractContentfulAssetIds(content)).toEqual(["assetABC"]);
  });

  it("extracts multiple unique asset IDs", () => {
    const content = `
![Image 1](//images.ctfassets.net/space/id1/v1/img1.webp)
![Image 2](//images.ctfassets.net/space/id2/v1/img2.webp)
`;
    expect(extractContentfulAssetIds(content)).toEqual(["id1", "id2"]);
  });

  it("deduplicates repeated asset IDs", () => {
    const content = `
![Image 1](//images.ctfassets.net/space/id1/v1/img1.webp)
![Image 1 again](//images.ctfassets.net/space/id1/v2/img1-large.webp)
`;
    expect(extractContentfulAssetIds(content)).toEqual(["id1"]);
  });

  it("returns empty array when no Contentful URLs are present", () => {
    const content = "## No images here";
    expect(extractContentfulAssetIds(content)).toEqual([]);
  });

  it("handles content with mixed image sources", () => {
    const content = `
![External](https://example.com/img.png)
![Contentful](//images.ctfassets.net/space/ctfId/v1/img.webp)
`;
    expect(extractContentfulAssetIds(content)).toEqual(["ctfId"]);
  });
});
