import { PostStatus, RawPost } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";
import { Asset } from "@/interfaces/asset";
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

const ASSET_QUERY = `
query FetchImageAssets($ids: [String]) {
  assetCollection(where: {sys: {id_in: $ids}, contentType_contains: "image/"}) {
    items {
      sys {
        id
      }
      title
      description
      contentType
      width
      height
      medium: url(transform: {height: 600})
      large: url(transform: {height: 1000})
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
      status
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
  status?: string;
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
  status: (post.status as PostStatus) || "active",
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

  async getAssets(ids: string[]): Promise<Asset[]> {
    if (ids.length === 0) return [];

    const res = await this.client.fetch(ASSET_QUERY, { ids });
    const assets = res.data.assetCollection.items as {
      sys: { id: string };
      title: string;
      description: string;
      contentType: string;
      width: number;
      height: number;
      medium: string;
      large: string;
    }[];

    return assets.map((asset) => ({
      slug: asset.sys.id,
      title: asset.title,
      description: asset.description,
      contentType: asset.contentType,
      width: asset.width,
      height: asset.height,
      medium: asset.medium,
      large: asset.large,
    }));
  }
}
