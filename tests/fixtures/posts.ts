import { Post, RawPost } from "@/interfaces/post";
import { ContentfulPost } from "@/lib/app/stores/contentful-blog";
import { tag1 } from "./tags";

export const mockContentfulPost: ContentfulPost = {
  title: "Post 1",
  slug: "post-1",
  publishDate: "2024-01-01",
  description: "Excerpt",
  status: "active",
  tagsCollection: {
    items: [tag1],
  },
  content:
    "Content with some text\n\n> [!IMAGE_GALLERY]\n> ![Img](//images.ctfassets.net/s/id1/v/i.jpg)\n",
};

export const mockRawPost: RawPost = {
  title: "Post 1",
  slug: "post-1",
  publishDate: "2024-01-01",
  description: "Excerpt",
  tags: [tag1.slug],
  status: "active",
  content: mockContentfulPost.content,
};

export const post1: Post = {
  ...mockRawPost,
  content: () => {},
};

export const post2: Post = {
  title: "Test Post 2",
  slug: "test-post-2",
  publishDate: "2024-01-02",
  description: "Excerpt 2",
  tags: [tag1.slug, "tag3"],
  status: "active",
  content: () => {},
};
