import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import path from "path";
import { ImportPostsTask } from "./import-posts";
import { createTestContext, TestContext } from "@test/context";
import { mockRawPost, post1 } from "@test/fixtures/posts";
import { tag1 } from "@test/fixtures/tags";
import { asset1, asset2 } from "@test/fixtures/assets";

describe("ImportPostsTask", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    context.mocks.graphql.start();

    // Pre-populate the blog posts directory with a raw .mdx file
    // (simulating the source-of-truth files already being present)
    await context.stores.blogPosts.writeAll([mockRawPost]);
  });

  afterEach(() => {
    context.mocks.graphql.verify();
    context.teardown();
  });

  it("should import tags and assets from Contentful based on local post content", async () => {
    context.mocks.graphql.expectQuery({
      operationName: "FetchTags",
      variables: { slugs: [tag1.slug], limit: 100, skip: 0 },
      response: {
        data: {
          tagCollection: {
            items: [tag1],
          },
        },
      },
    });

    context.mocks.graphql.expectQuery({
      operationName: "FetchImageAssets",
      variables: {
        ids: [asset2.sys.id, asset1.sys.id],
        limit: 100,
        skip: 0,
      },
      response: {
        data: {
          assetCollection: {
            items: [asset1, asset2],
          },
        },
      },
    });

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
    expect(blogTagsSpy).toHaveBeenCalledWith([tag1], {
      deleteExisting: true,
    });

    const rootDir = context.config.storage.rootDir;
    expect(results).toEqual({
      tags: [path.join(rootDir, "blog/tags/tag-1.json")],
      assets: [
        path.join(rootDir, "assets/images/id1.json"),
        path.join(rootDir, "assets/images/5X0ig9hXwUzwXITz03HOS1.json"),
      ],
    });

    // Verify post1 slug is used (fixture sanity check)
    expect(post1.slug).toBe("post-1");
  });
});
