export function transformMarkdownContent(content: string): {
  transformedContent: string;
  assetIds: string[];
} {
  const assetIds: string[] = [];

  // 1. Transform Image Gallery
  // Regex to match the blockquote with [!IMAGE_GALLERY]
  // It matches from "> [!IMAGE_GALLERY]" until a line that doesn't start with ">" (or end of string)
  const galleryRegex = /^> \[!IMAGE_GALLERY\]\n(?:>.*\n?)*/gm;

  let transformedContent = content.replace(galleryRegex, (match) => {
    // Extract asset IDs from the match
    // Asset ID is the second segment after the domain in Contentful image URLs
    // //images.ctfassets.net/spaceId/assetId/version/filename
    const assetIdRegex = /\/\/images\.ctfassets\.net\/[^/]+\/([^/]+)\//g;
    const ids: string[] = [];
    let assetMatch;
    while ((assetMatch = assetIdRegex.exec(match)) !== null) {
      ids.push(assetMatch[1]);
      assetIds.push(assetMatch[1]);
    }

    const children = ids
      .map((id) => `<ImageCarouselItem assetId="${id}" />`)
      .join("\n");
    return `<ImageCarousel>\n${children}\n</ImageCarousel>\n`;
  });

  // 2. Transform Callouts
  // Regex to match blockquotes with [!INFO], [!WARNING], [!ERROR], [!SUCCESS]
  const calloutRegex = /^> \[!(INFO|WARNING|ERROR|SUCCESS)\]\n(?:>.*\n?)*/gm;

  transformedContent = transformedContent.replace(calloutRegex, (match) => {
    const lines = match.split("\n").map((line) => line.replace(/^>\s?/, ""));
    const type = lines[0].match(/\[!(INFO|WARNING|ERROR|SUCCESS)\]/)?.[1];

    if (!type) return match;

    const title = lines[1]?.trim();
    const body = lines.slice(2).join("\n").trim();

    const variantMap: Record<string, string> = {
      INFO: "info",
      SUCCESS: "success",
      WARNING: "warning",
      ERROR: "error",
    };

    const variant = variantMap[type] || "info";
    const titleAttr = title ? ` title="${title}"` : "";

    return `<Callout variant="${variant}"${titleAttr}>\n${body}\n</Callout>\n`;
  });

  return { transformedContent, assetIds: Array.from(new Set(assetIds)) };
}
