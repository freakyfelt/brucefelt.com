import { Post } from "@/interfaces/post";
import { cache } from "react";
import { Tag } from "@/interfaces/tag";
import { appContext } from "@/lib/app/context";

type ImportResults = {
  posts: string[];
  tags: string[];
};

export async function importPosts(): Promise<ImportResults> {
  const metadata = await appContext.stores.contentfulBlog.getAllPostSlugs();
  const slugs = metadata.map((m) => m.slug);
  const posts = await appContext.stores.contentfulBlog.getBlogPosts(slugs);

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

export const getAllPosts = cache(
  async (options?: { includeNonActive?: boolean }): Promise<Post[]> => {
    const allPostsData = await appContext.stores.posts.readAll();
    if (allPostsData.length === 0) {
      throw new Error(
        "No posts found in the data directory. Need to run `npm run import`",
      );
    }

    const posts = options?.includeNonActive
      ? allPostsData
      : allPostsData.filter((post) => post.status === "active");

    return posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  },
);

export const getAllTags = async (): Promise<Tag[]> => {
  const allTagsData = await appContext.stores.tags.readAll();
  if (allTagsData.length === 0) {
    throw new Error(
      "No tags found in the data directory. Need to run `npm run import`",
    );
  }

  return allTagsData;
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  const tags = await getAllTags();

  return tags.find((tag) => tag.slug === slug) || null;
};

export const getRecentPosts = async (count: number = 5): Promise<Post[]> => {
  const posts = await getAllPosts();

  return posts.slice(0, count);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts({ includeNonActive: true });

  return posts.find((post) => post.slug === slug) || null;
};

export const getPostsByTag = async (tag: string): Promise<Post[]> => {
  const posts = await getAllPosts();

  return posts.filter((post) => post.tags?.includes(tag));
};
