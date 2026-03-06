import { ImageAsset, ImageAssetSchema } from "@/interfaces/image-asset";
import { Post, PostSchema, RawPost } from "@/interfaces/post";
import { Tag, TagSchema } from "@/interfaces/tag";
import "dotenv/config";
import path from "path";
import {
  ContentfulConfig,
  ContentfulGraphQLClient,
} from "./clients/contentful";
import { FilesystemStorage, StorageConfig } from "./clients/filesystem";
import { ContentfulBlogStore } from "./stores/contentful-blog";

export type AppConfig = {
  contentful: ContentfulConfig;
  storage: StorageConfig;
};

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

export const config: AppConfig = {
  contentful: {
    spaceId: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  },
  storage: {
    rootDir: path.join(process.cwd(), "data"),
  },
};

export function createAppContext(config: AppConfig) {
  const clients = {
    contentful: new ContentfulGraphQLClient(config.contentful),
    storage: new FilesystemStorage(config.storage),
  };

  const stores = {
    contentfulBlog: new ContentfulBlogStore(clients.contentful),
    blogPosts: clients.storage.forMdx<RawPost, Post>({
      pathPrefix: "blog/posts",
      schema: PostSchema,
    }),
    blogTags: clients.storage.forJSON<Tag>({
      pathPrefix: "blog/tags",
      schema: TagSchema,
    }),
    imageAssets: clients.storage.forJSON<ImageAsset>({
      pathPrefix: "assets/images",
      schema: ImageAssetSchema,
    }),
  };

  return { config, clients, stores };
}

export type AppContext = ReturnType<typeof createAppContext>;

export const appContext = createAppContext(config);
