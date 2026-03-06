import { Tag } from "@/interfaces/tag";
import { appContext, AppContext } from "@/lib/app/context";
import { staticImageAssets } from "@/lib/data/assets";
import { transformMarkdownContent } from "@/lib/app/utils/mdx/markdown-transformer";

type ImportResults = {
  posts: string[];
  tags: string[];
  assets: string[];
  raw: {
    posts: string[];
  };
};

export class ImportPostsTask {
  constructor(private context: AppContext) {}

  async perform(): Promise<ImportResults> {
    const metadata = await this.context.stores.contentfulBlog.getAllPostSlugs();
    const slugs = metadata.map((m) => m.slug);
    const rawPosts =
      await this.context.stores.contentfulBlog.getBlogPosts(slugs);

    // Phase 1: Write raw markdown files
    const rawPostPaths = await this.context.stores.rawBlogPosts.writeAll(
      rawPosts,
      {
        deleteExisting: true,
      },
    );

    // Phase 2: Process raw markdown files to MDX
    const allAssetIds = new Set<string>(Object.values(staticImageAssets));
    const processedPosts = rawPosts.map((post) => {
      const { transformedContent, assetIds } = transformMarkdownContent(
        post.content,
      );
      assetIds.forEach((id) => allAssetIds.add(id));
      return {
        ...post,
        content: transformedContent,
      };
    });

    const assets = await this.context.stores.contentfulBlog.getAssets(
      Array.from(allAssetIds),
    );
    const assetPaths = await this.context.stores.imageAssets.writeAll(assets, {
      deleteExisting: true,
    });

    const tagsBySlug = metadata.reduce((acc, m) => {
      m.tags.forEach((tag) => {
        acc.set(tag.slug, tag);
      });
      return acc;
    }, new Map<string, Tag>());

    const tags = Array.from(tagsBySlug.values());

    const tagPaths = await this.context.stores.blogTags.writeAll(tags, {
      deleteExisting: true,
    });
    const postPaths = await this.context.stores.blogPosts.writeAll(
      processedPosts,
      {
        deleteExisting: true,
      },
    );

    return {
      posts: postPaths,
      tags: tagPaths,
      assets: assetPaths,
      raw: { posts: rawPostPaths },
    };
  }
}

export async function importPosts(): Promise<ImportResults> {
  const task = new ImportPostsTask(appContext);
  return task.perform();
}
