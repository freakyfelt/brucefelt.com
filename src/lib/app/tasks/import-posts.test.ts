import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { ImportPostsTask } from "./import-posts";
import { AppContext } from "@/lib/app/context";
import { MockGraphQLServer } from "@test/utils/mock-server";
import { ContentfulBlogStore } from "@/lib/app/stores/contentful-blog";
import { ContentfulGraphQLClient } from "@/lib/app/clients/contentful";
import {
  mockTags,
  mockContentfulPostMetadata,
  mockContentfulPost,
  mockContentfulAssets,
} from "@test/fixtures/contentful";

const mockServer = new MockGraphQLServer();

describe("ImportPostsTask", () => {
  beforeAll(() => mockServer.start());
  afterAll(() => mockServer.stop());
  afterEach(() => {
    mockServer.verify();
    mockServer.reset();
  });

  it("should import posts and tags correctly", async () => {
    // Register expected queries
    mockServer.expectQuery({
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

    mockServer.expectQuery({
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

    mockServer.expectQuery({
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

    const mockBlogPosts = {
      writeAll: vi.fn().mockResolvedValue(["path/to/post-1.mdx"]),
    };
    const mockBlogTags = {
      writeAll: vi.fn().mockResolvedValue(["path/to/tag-1.json"]),
    };
    const mockImageAssets = {
      writeAll: vi.fn().mockResolvedValue(["path/to/asset-1.json"]),
    };

    const contentfulClient = new ContentfulGraphQLClient({
      spaceId: "test-space",
      accessToken: "test-token",
    });
    const contentfulBlog = new ContentfulBlogStore(contentfulClient);

    const mockContext = {
      stores: {
        contentfulBlog,
        blogPosts: mockBlogPosts,
        blogTags: mockBlogTags,
        imageAssets: mockImageAssets,
      },
    } as unknown as AppContext;

    const task = new ImportPostsTask(mockContext);
    const results = await task.perform();

    expect(mockImageAssets.writeAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ slug: "id1" }),
        expect.objectContaining({ slug: "5X0ig9hXwUzwXITz03HOS1" }),
      ]),
      {
        deleteExisting: true,
      },
    );
    expect(mockBlogTags.writeAll).toHaveBeenCalledWith(mockTags, {
      deleteExisting: true,
    });

    // Check that posts were written with transformed content
    expect(mockBlogPosts.writeAll).toHaveBeenCalled();
    const writtenPosts = mockBlogPosts.writeAll.mock.calls[0][0];
    expect(writtenPosts[0].content).not.toContain("//images.ctfassets.net");

    expect(results).toEqual({
      posts: ["path/to/post-1.mdx"],
      tags: ["path/to/tag-1.json"],
      assets: ["path/to/asset-1.json"],
    });
  });
});
