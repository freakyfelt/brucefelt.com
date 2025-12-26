import { Document } from "@contentful/rich-text-types";

export type Post = {
  title: string;
  slug: string;
  publishDate: string;
  /** the meta:description for the post */
  description: string;
  tags?: string[];
  heroImage?: string;
  body: Document;
};
