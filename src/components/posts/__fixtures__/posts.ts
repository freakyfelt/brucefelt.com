import { Post } from "@/interfaces/post";
import { BLOCKS } from "@contentful/rich-text-types";

export const post1: Post = {
  title: "Test Post 1",
  slug: "test-post-1",
  publishDate: "2024-01-01",
  description: "Excerpt 1",
  body: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        content: [
          {
            nodeType: "text",
            value: "This is the content of the post.",
            marks: [],
            data: {},
          },
        ],
        data: {},
      },
    ],
  },
};

export const post2: Post = {
  title: "Test Post 2",
  slug: "test-post-2",
  publishDate: "2024-01-02",
  description: "Excerpt 2",
  body: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        content: [
          {
            nodeType: "text",
            value: "This is the content of the post.",
            marks: [],
            data: {},
          },
        ],
        data: {},
      },
    ],
  },
};
