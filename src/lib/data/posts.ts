import { Post } from "@/interfaces/post";
import { cache } from "react";
import fs from "fs";
import path from "path";
import { getAllPostSlugs, getBlogPosts } from "../clients/contentful";

const DATA_DIR = path.join(process.cwd(), "data/posts");

export async function importPosts() {
  const metadata = await getAllPostSlugs();
  const slugs = metadata.map((m) => m.slug);

  const posts = await getBlogPosts(slugs);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const imported = posts.map((post) => {
    const filePath = path.join(DATA_DIR, `${post.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    return filePath;
  });

  return imported;
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  if (!fs.existsSync(DATA_DIR)) return [];

  const fileNames = fs.readdirSync(DATA_DIR);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(DATA_DIR, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContent) as Post;
    });
  if (allPostsData.length === 0) {
    throw new Error(
      "No posts found in the data directory. Need to run `npm run import`",
    );
  }

  return allPostsData.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
});

export const getRecentPosts = async (count: number = 5): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, count);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as Post;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPostsByTag = async (tag: string): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags?.includes(tag));
};

export const getAllTags = async (): Promise<string[]> => {
  const allPosts = await getAllPosts();
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
};
