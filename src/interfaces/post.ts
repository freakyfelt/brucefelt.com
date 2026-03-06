import { z } from "zod";
import { MDXContent } from "mdx/types";

const PostStatusEnum = z.enum(["active", "archived", "draft"]);

export type PostStatus = z.infer<typeof PostStatusEnum>;

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  publishDate: z.iso.date({
    message: "Publish date must be a valid ISO 8601 date string",
  }),
  /** the meta:description for the post */
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  heroImage: z.url("Hero image must be a valid URL").optional(),
  status: PostStatusEnum,
});

export type Post = z.infer<typeof PostSchema> & {
  content: MDXContent;
};

export type RawPost = Omit<Post, "content"> & {
  content: string;
};
