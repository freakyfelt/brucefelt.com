import { Tag } from "@/interfaces/tag";
import { ImageAsset } from "@/interfaces/image-asset";
import { ContentfulGraphQLClient } from "../clients/contentful";

const ASSET_QUERY = `
query FetchImageAssets($ids: [String], $limit: Int, $skip: Int = 0) {
  assetCollection(where: {sys: {id_in: $ids}, contentType_contains: "image/"}, limit: $limit, skip: $skip) {
    items {
      sys {
        id
      }
      title
      description
      contentType
      width
      height
      url
    }
  }
}
`;

export type ContentfulPostMetadata = Pick<
  ContentfulPost,
  "slug" | "tagsCollection"
>;

const TAG_QUERY = `
query FetchTags($slugs: [String], $limit: Int, $skip: Int = 0) {
  tagCollection(where: {slug_in: $slugs}, limit: $limit, skip: $skip) {
    items {
      slug
      displayName
      description
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

export type RawImageAsset = {
  sys: { id: string };
  title: string;
  description: string;
  contentType: string;
  width: number;
  height: number;
  url: string;
};

const decodeContentfulImage = (asset: RawImageAsset): ImageAsset => ({
  slug: asset.sys.id,
  title: asset.title,
  description: asset.description,
  contentType: asset.contentType,
  width: asset.width,
  height: asset.height,
  url: asset.url,
});

export class ContentfulBlogStore {
  constructor(private client: ContentfulGraphQLClient) {}

  async getTagsBySlugs(slugs: string[]): Promise<Tag[]> {
    if (slugs.length === 0) return [];

    return this.client.batchFetch(TAG_QUERY, { slugs }, 100, (data) => {
      return data!.tagCollection!.items as Tag[];
    });
  }

  async getAssets(ids: string[]): Promise<ImageAsset[]> {
    if (ids.length === 0) return [];

    return this.client.batchFetch(ASSET_QUERY, { ids }, 100, (data) => {
      const assets = data!.assetCollection!.items as RawImageAsset[];
      return assets.map(decodeContentfulImage);
    });
  }
}
