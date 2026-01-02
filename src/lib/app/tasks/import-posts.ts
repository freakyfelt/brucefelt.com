import { Tag } from "@/interfaces/tag";
import { appContext } from "@/lib/app/context";

type ImportResults = {
  posts: string[];
  tags: string[];
};

export async function importPosts(): Promise<ImportResults> {
  const metadata = await appContext.stores.contentfulBlog.getAllPostSlugs();
  const slugs = metadata.map((m) => m.slug);
  const rawPosts = await appContext.stores.contentfulBlog.getBlogPosts(slugs);

  const allAssetIds = new Set<string>();
  const posts = rawPosts.map((post) => {
    const { transformedContent, assetIds } = transformPostContent(post.content);
    assetIds.forEach((id) => allAssetIds.add(id));
    return {
      ...post,
      content: transformedContent,
    };
  });

  const assets = await appContext.stores.contentfulBlog.getAssets(
    Array.from(allAssetIds),
  );
  await appContext.stores.contentfulAssets.writeAll(assets, {
    deleteExisting: true,
  });

  const tagsBySlug = metadata.reduce((acc, m) => {
    m.tags.forEach((tag) => {
      acc.set(tag.slug, tag);
    });
    return acc;
  }, new Map<string, Tag>());

  const tags = Array.from(tagsBySlug.values());

  const tagPaths = await appContext.stores.tags.writeAll(tags, {
    deleteExisting: true,
  });
  const postPaths = await appContext.stores.posts.writeAll(posts, {
    deleteExisting: true,
  });

  return { posts: postPaths, tags: tagPaths };
}

export function transformPostContent(content: string): {
  transformedContent: string;
  assetIds: string[];
} {
  const assetIds: string[] = [];

  // Regex to match the blockquote with [!IMAGE_GALLERY]
  // It matches from "> [!IMAGE_GALLERY]" until a line that doesn't start with ">" (or end of string)
  const galleryRegex = /^> \[!IMAGE_GALLERY\]\n(?:>.*\n?)*/gm;

  const transformedContent = content.replace(galleryRegex, (match) => {
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

  return { transformedContent, assetIds: Array.from(new Set(assetIds)) };
}
