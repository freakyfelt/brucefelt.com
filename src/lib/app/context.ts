import "dotenv/config";
import path from "path";
import { FilesystemStorage, StorageConfig } from "./clients/filesystem";
import {
  ContentfulConfig,
  ContentfulGraphQLClient,
} from "./clients/contentful";
import { Post, RawPost } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";
import { ContentfulBlogStore } from "./stores/contentful-blog";
import { ImageAsset } from "@/interfaces/image-asset";

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
    blogPosts: clients.storage.forMarkdown<RawPost, Post>({
      pathPrefix: "blog/posts",
    }),
    blogTags: clients.storage.forJSON<Tag>({ pathPrefix: "blog/tags" }),
    imageAssets: clients.storage.forJSON<ImageAsset>({
      pathPrefix: "assets/images",
    }),
  };

  return { config, clients, stores };
}

export type AppContext = ReturnType<typeof createAppContext>;

export const appContext = createAppContext(config);
