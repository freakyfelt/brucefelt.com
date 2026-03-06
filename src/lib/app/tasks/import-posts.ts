import { appContext, AppContext } from "@/lib/app/context";
import { staticImageAssets } from "@/lib/data/assets";
import { extractContentfulAssetIds } from "@/lib/app/utils/asset-scanner";

type ImportResults = {
  tags: string[];
  assets: string[];
};

export class ImportPostsTask {
  constructor(private context: AppContext) {}

  async perform(): Promise<ImportResults> {
    // Phase 1: Read local .mdx posts as raw text (no MDX compilation)
    const rawPosts = await this.context.stores.blogPosts.readAllRaw();

    // Phase 2: Extract Contentful asset IDs from post content
    const allAssetIds = new Set<string>(Object.values(staticImageAssets));
    for (const post of rawPosts) {
      const ids = extractContentfulAssetIds(post.content);
      ids.forEach((id) => allAssetIds.add(id));
    }

    // Phase 3: Fetch assets from Contentful and write to filesystem
    const assets = await this.context.stores.contentfulBlog.getAssets(
      Array.from(allAssetIds),
    );
    const assetPaths = await this.context.stores.imageAssets.writeAll(assets, {
      deleteExisting: true,
    });

    // Phase 4: Collect tag slugs from frontmatter, fetch from Contentful
    const allTagSlugs = [...new Set(rawPosts.flatMap((p) => p.tags))];
    const tags =
      await this.context.stores.contentfulBlog.getTagsBySlugs(allTagSlugs);
    const tagPaths = await this.context.stores.blogTags.writeAll(tags, {
      deleteExisting: true,
    });

    return { tags: tagPaths, assets: assetPaths };
  }
}

export async function importPosts(): Promise<ImportResults> {
  const task = new ImportPostsTask(appContext);
  return task.perform();
}
