import { Post } from "@/interfaces/post";

export const post1: Post = {
  title: "Test Post 1",
  slug: "test-post-1",
  publishDate: "2024-01-01",
  description: "Excerpt 1",
  tags: ["tag1", "tag2"],
  content: () => {},
};

export const post2: Post = {
  title: "Test Post 2",
  slug: "test-post-2",
  publishDate: "2024-01-02",
  description: "Excerpt 2",
  tags: ["tag1", "tag3"],
  content: () => {},
};
