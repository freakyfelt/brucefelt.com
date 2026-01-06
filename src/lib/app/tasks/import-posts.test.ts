import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import path from "path";
import { ImportPostsTask } from "./import-posts";
import { createTestContext, TestContext } from "@test/context";
import {
  mockTags,
  mockContentfulPostMetadata,
  mockContentfulPost,
  mockContentfulAssets,
} from "@test/fixtures/contentful";

describe("ImportPostsTask", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
    context.mocks.graphql.start();
  });

  afterEach(() => {
    context.mocks.graphql.verify();
    context.teardown();
  });

  it("should import posts and tags correctly", async () => {
    // Register expected queries
    context.mocks.graphql.expectQuery({
      operationName: "FetchAllPostSlugs",
      variables: { limit: 100, skip: 0 },
      response: {
        data: {
          blogPostCollection: {
            items: [mockContentfulPostMetadata],
          },
        },
      },
    });

    context.mocks.graphql.expectQuery({
      operationName: "FetchBlogPosts",
      variables: { slugs: ["post-1"], limit: 10, skip: 0 },
      response: {
        data: {
          blogPostCollection: {
            items: [mockContentfulPost],
          },
        },
      },
    });

    context.mocks.graphql.expectQuery({
      operationName: "FetchImageAssets",
      variables: {
        ids: ["5X0ig9hXwUzwXITz03HOS1", "id1"],
        limit: 100,
        skip: 0,
      },
      response: {
        data: {
          assetCollection: {
            items: mockContentfulAssets,
          },
        },
      },
    });

    const blogPostsSpy = vi.spyOn(context.stores.blogPosts, "writeAll");
    const blogTagsSpy = vi.spyOn(context.stores.blogTags, "writeAll");
    const imageAssetsSpy = vi.spyOn(context.stores.imageAssets, "writeAll");

    const task = new ImportPostsTask(context);
    const results = await task.perform();

    expect(imageAssetsSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ slug: "id1" }),
        expect.objectContaining({ slug: "5X0ig9hXwUzwXITz03HOS1" }),
      ]),
      {
        deleteExisting: true,
      },
    );
    expect(blogTagsSpy).toHaveBeenCalledWith(mockTags, {
      deleteExisting: true,
    });

    // Check that posts were written with transformed content
    expect(blogPostsSpy).toHaveBeenCalled();
    const writtenPosts = blogPostsSpy.mock.calls[0][0];
    expect(writtenPosts[0].content).not.toContain("//images.ctfassets.net");

    const rootDir = context.config.storage.rootDir;
    expect(results).toEqual({
      posts: [path.join(rootDir, "blog/posts/post-1.mdx")],
      tags: [path.join(rootDir, "blog/tags/tag-1.json")],
      assets: [
        path.join(rootDir, "assets/images/id1.json"),
        path.join(rootDir, "assets/images/5X0ig9hXwUzwXITz03HOS1.json"),
      ],
    });
  });
});
