import { RawPost } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";
import { ContentfulGraphQLClient } from "../clients/contentful";

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

type PostMetadata = {
  slug: string;
  tags: Tag[];
};

export class ContentfulBlogStore {
  constructor(private client: ContentfulGraphQLClient) {}

  async getAllPostSlugs(): Promise<PostMetadata[]> {
    return this.client.batchFetch(ALL_POST_SLUGS_QUERY, {}, 100, (data) => {
      const posts = data!.blogPostCollection!.items as ContentfulPostMetadata[];
      return posts.map((post) => ({
        slug: post.slug,
        tags: post.tagsCollection.items,
      }));
    });
  }

  async getBlogPosts(slugs: string[]): Promise<RawPost[]> {
    return this.client.batchFetch(POST_CONTENT_QUERY, { slugs }, 10, (data) => {
      const posts = data!.blogPostCollection!.items as ContentfulPost[];
      return posts.map(decodeContentfulPost);
    });
  }
}
