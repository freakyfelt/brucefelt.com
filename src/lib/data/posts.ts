import { PostMetadata } from "@/interfaces/post";
import { cache } from "react";
import fs from "fs";
import path from "path";
import { MDXContent } from "mdx/types";

type Post = {
  metadata: PostMetadata;
  content: React.ComponentType;
};

const postsDirectory = path.join(process.cwd(), "src/content/posts");

const importPost = cache(async (slug: string): Promise<Post> => {
  const { metadata, default: content } = await import(
    `@/content/posts/${slug}.mdx`
  );
  return { metadata: { ...metadata, slug }, content };
});

export const getAllPostMetadata = cache(async (): Promise<PostMetadata[]> => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const { metadata } = await importPost(slug);

        return metadata;
      }),
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getRecentPosts = async (
  count: number = 5,
): Promise<PostMetadata[]> => {
  const allPosts = await getAllPostMetadata();
  return allPosts.slice(0, count);
};

export const getPostMetadataBySlug = async (
  slug: string,
): Promise<PostMetadata | null> => {
  try {
    const { metadata } = await importPost(slug);

    return metadata;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPostContent = async (slug: string): Promise<MDXContent> => {
  const { content } = await importPost(slug);

  return content as MDXContent;
};
