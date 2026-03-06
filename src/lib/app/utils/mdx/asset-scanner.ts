const CONTENTFUL_ASSET_ID_RE = /\/\/images\.ctfassets\.net\/[^/]+\/([^/]+)\//;

/**
 * Extracts the Contentful asset ID from a single image URL.
 *
 * Matches URLs in the format:
 * `//images.ctfassets.net/<spaceId>/<assetId>/<version>/<filename>`
 *
 * @returns The asset ID, or `null` if the URL is not a Contentful image URL.
 */
export function extractContentfulAssetIdFromSrc(src: string): string | null {
  const m = src.match(CONTENTFUL_ASSET_ID_RE);
  return m ? m[1] : null;
}

/**
 * Extracts Contentful asset IDs from raw markdown/MDX content.
 *
 * Scans for Contentful image URLs in the format:
 * `//images.ctfassets.net/<spaceId>/<assetId>/<version>/<filename>`
 *
 * @returns Deduplicated list of asset IDs found in the content.
 */
export function extractContentfulAssetIds(content: string): string[] {
  const re = new RegExp(CONTENTFUL_ASSET_ID_RE.source, "g");
  const ids = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
}
