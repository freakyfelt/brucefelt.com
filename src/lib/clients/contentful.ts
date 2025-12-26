import { RawPost } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

const ALL_POST_SLUGS_QUERY = `
query FetchAllPostSlugs($limit: Int, $skip: Int = 0) {
  blogPostCollection(limit: $limit, skip: $skip, order: publishDate_DESC) {
    items {
      slug
      tagsCollection(limit: 10) {
        items {
          slug
          displayName
          description
        }
      }
    }
  }
}
`;

type ContentfulPostMetadata = Pick<ContentfulPost, "slug" | "tagsCollection">;

const POST_CONTENT_QUERY = `
query FetchBlogPosts($slugs: [String]) {
  blogPostCollection(where: {slug_in: $slugs}) {
    items {
      slug
      title
      description
      publishDate
      tagsCollection(limit: 10) {
        items {
          slug
        }
      }
      heroImage {
        url(transform: {height: 1024})
      }
      content
    }
  }
}
`;

export type ContentfulPost = {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  tagsCollection: {
    items: Tag[];
  };
  heroImage?: {
    url: string;
  };
  content: string;
};

const decodeContentfulPost = (post: ContentfulPost): RawPost => ({
  title: post.title,
  slug: post.slug,
  publishDate: post.publishDate,
  description: post.description,
  tags: post.tagsCollection.items.map((tag) => tag.slug),
  heroImage: post.heroImage?.url,
  content: post.content,
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

/**
 * uses a skip/limit approach to fetch all results
 */
async function batchFetchGraphQL<TOut>(
  query: string,
  variables: Record<string, unknown> = {},
  batchSize: number = 100,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer: (data: any) => TOut[],
): Promise<TOut[]> {
  const results: TOut[] = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const res = await fetchGraphQL(query, {
      ...variables,
      skip,
      limit: batchSize,
    });
    const batchResults = transformer(res.data);
    results.push(...batchResults);
    hasMore = batchResults.length === batchSize;
    skip += batchSize;
  }

  return results;
}

type PostMetadata = {
  slug: string;
  tags: Tag[];
};

export async function getAllPostSlugs(): Promise<PostMetadata[]> {
  return batchFetchGraphQL(ALL_POST_SLUGS_QUERY, {}, 100, (data) => {
    const posts = data!.blogPostCollection!.items as ContentfulPostMetadata[];
    return posts.map((post) => ({
      slug: post.slug,
      tags: post.tagsCollection.items,
    }));
  });
}

export async function getBlogPosts(slugs: string[]): Promise<RawPost[]> {
  return batchFetchGraphQL(POST_CONTENT_QUERY, { slugs }, 10, (data) => {
    const posts = data!.blogPostCollection!.items as ContentfulPost[];
    return posts.map(decodeContentfulPost);
  });
}
