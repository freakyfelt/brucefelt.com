import { describe, it, expect, vi } from "vitest";
import { ImportPostsTask } from "./import-posts";
import { AppContext } from "@/lib/app/context";
import { Tag } from "@/interfaces/tag";
import { RawPost } from "@/interfaces/post";
import { ImageAsset } from "@/interfaces/image-asset";

describe("ImportPostsTask", () => {
  it("should import posts and tags correctly", async () => {
    const mockTags: Tag[] = [
      { displayName: "Tag 1", slug: "tag-1", description: "Desc" },
    ];
    const mockMetadata = [{ slug: "post-1", tags: mockTags }];
    const mockRawPosts: RawPost[] = [
      {
        title: "Post 1",
        slug: "post-1",
        content:
          "Content with some text\n\n> [!IMAGE_GALLERY]\n> ![Img](//images.ctfassets.net/s/id1/v/i.jpg)\n",
        publishDate: "2024-01-01",
        description: "Excerpt",
        tags: ["tag-1"],
        status: "active",
      },
    ];
    const mockAssets: ImageAsset[] = [
      {
        slug: "id1",
        url: "url1",
        title: "f.jpg",
        description: "desc",
        contentType: "image/jpeg",
        width: 100,
        height: 100,
      },
    ];

    const mockContentfulBlog = {
      getAllPostSlugs: vi.fn().mockResolvedValue(mockMetadata),
      getBlogPosts: vi.fn().mockResolvedValue(mockRawPosts),
      getAssets: vi.fn().mockResolvedValue(mockAssets),
    };

    const mockBlogPosts = {
      writeAll: vi.fn().mockResolvedValue(["path/to/post-1.mdx"]),
    };
    const mockBlogTags = {
      writeAll: vi.fn().mockResolvedValue(["path/to/tag-1.json"]),
    };
    const mockImageAssets = {
      writeAll: vi.fn().mockResolvedValue(["path/to/asset-1.json"]),
    };

    const mockContext = {
      stores: {
        contentfulBlog: mockContentfulBlog,
        blogPosts: mockBlogPosts,
        blogTags: mockBlogTags,
        imageAssets: mockImageAssets,
      },
    } as unknown as AppContext;

    const task = new ImportPostsTask(mockContext);
    const results = await task.perform();

    expect(mockContentfulBlog.getAllPostSlugs).toHaveBeenCalled();
    expect(mockContentfulBlog.getBlogPosts).toHaveBeenCalledWith(["post-1"]);

    // Check that assets were fetched (including static ones and those from content)
    expect(mockContentfulBlog.getAssets).toHaveBeenCalled();
    const fetchedAssetIds = mockContentfulBlog.getAssets.mock.calls[0][0];
    console.log("Fetched Asset IDs:", fetchedAssetIds);
    expect(fetchedAssetIds).toContain("id1");
    expect(fetchedAssetIds).toContain("5X0ig9hXwUzwXITz03HOS1");

    expect(mockImageAssets.writeAll).toHaveBeenCalledWith(mockAssets, {
      deleteExisting: true,
    });
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
