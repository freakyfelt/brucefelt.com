import { MDXContent } from "mdx/types";

export type Post = {
  title: string;
  slug: string;
  publishDate: string;
  /** the meta:description for the post */
  description: string;
  tags: string[];
  heroImage?: string;
  content: MDXContent;
};

export type RawPost = Omit<Post, "content"> & {
  content: string;
};
