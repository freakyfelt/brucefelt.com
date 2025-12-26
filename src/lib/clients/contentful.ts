import { Post } from "@/interfaces/post";
import { Document } from "@contentful/rich-text-types";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

const BATCH_SIZE = 100;

// use the content-model.json to generate the query
const ALL_POST_SLUGS_QUERY = `
query FetchAllPostSlugs($limit: Int, $skip: Int = 0) {
  blogPostCollection(limit: $limit, skip: $skip, order: publishDate_DESC) {
    items {
      slug
    }
  }
}
`;

const POST_CONTENT_QUERY = `
query FetchBlogPosts($slugs: [String]) {
  blogPostCollection(where: {slug_in: $slugs}) {
    items {
      slug
      title
      description
      publishDate
      tags
      heroImage {
        url(transform: {height: 1024})
      }
      body {
        json
      }
    }
  }
}
`;

export type ContentfulPost = {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
  heroImage?: {
    url: string;
  };
  body: {
    json: Document;
  };
};

const decodeContentfulPost = (post: ContentfulPost): Post => ({
  title: post.title,
  slug: post.slug,
  publishDate: post.publishDate,
  description: post.description,
  tags: post.tags,
  heroImage: post.heroImage?.url,
  body: post.body.json,
});

async function fetchGraphQL(
  query: string,
  variables: Record<string, unknown> = {},
) {
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error("Contentful credentials are not set");
  }
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!res.ok) {
    console.error("GraphQL Error:", await res.text());
    throw new Error("Failed to fetch data from Contentful");
  }
  return res.json();
}

type PostMetadata = {
  slug: string;
};

export async function getAllPostSlugs(): Promise<PostMetadata[]> {
  // Fetch all posts in batches of BATCH_SIZE
  const allPosts: PostMetadata[] = [];
  let hasMore = true;
  let skip = 0;

  while (hasMore) {
    const entries = await fetchGraphQL(ALL_POST_SLUGS_QUERY, {
      limit: BATCH_SIZE,
      skip,
    });
    const posts = entries?.data?.blogPostCollection?.items;
    if (posts) {
      allPosts.push(...posts);
    }
    hasMore = posts?.length === BATCH_SIZE;
    skip += BATCH_SIZE;
  }

  return allPosts;
}

export async function getBlogPosts(slugs: string[]): Promise<Post[]> {
  const entries = await fetchGraphQL(POST_CONTENT_QUERY, { slugs });
  return (entries?.data?.blogPostCollection?.items || []).map(
    decodeContentfulPost,
  );
}
