import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  FilesystemStorage,
  JsonFilesystemStorage,
  MdxFilesystemStorage,
} from "./filesystem";
import { RawPost, Post } from "@/interfaces/post";
import { ImageAsset, ImageAssetSchema } from "@/interfaces/image-asset";

describe("MdxFilesystemStorage.readAllRaw", () => {
  let tmpDir: string;
  let store: MdxFilesystemStorage<RawPost, Post>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "fs-test-"));
    const storage = new FilesystemStorage({ rootDir: tmpDir });
    store = storage.forMdx<RawPost, Post>({ pathPrefix: "blog/posts" });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("reads back a post written with writeAll", async () => {
    const raw: RawPost = {
      slug: "test-post",
      title: "Test Post",
      publishDate: "2024-01-01",
      description: "A test post",
      tags: ["tag-1"],
      status: "active",
      content: "Hello **world**.",
    };

    await store.writeAll([raw]);
    const results = await store.readAllRaw();

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      slug: "test-post",
      title: "Test Post",
      tags: ["tag-1"],
      content: "Hello **world**.",
    });
  });

  it("reads multiple posts", async () => {
    const posts: RawPost[] = [
      {
        slug: "post-a",
        title: "Post A",
        publishDate: "2024-01-01",
        description: "A",
        tags: [],
        status: "active",
        content: "Content A",
      },
      {
        slug: "post-b",
        title: "Post B",
        publishDate: "2024-01-02",
        description: "B",
        tags: ["tag-1", "tag-2"],
        status: "active",
        content: "Content B",
      },
    ];

    await store.writeAll(posts);
    const results = await store.readAllRaw();

    expect(results).toHaveLength(2);
    const slugs = results.map((p) => p.slug).sort();
    expect(slugs).toEqual(["post-a", "post-b"]);
  });

  it("normalises CRLF line endings in file content", async () => {
    // Write a file manually with CRLF line endings
    const postsDir = path.join(tmpDir, "blog/posts");
    fs.mkdirSync(postsDir, { recursive: true });
    const crlfContent =
      "---\r\nslug: crlf-post\r\ntitle: CRLF Post\r\npublishDate: 2024-01-01\r\ndescription: Test\r\ntags: []\r\nstatus: active\r\n---\r\nBody content here\r\n";
    fs.writeFileSync(path.join(postsDir, "crlf-post.mdx"), crlfContent);

    const results = await store.readAllRaw();

    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("crlf-post");
    expect(results[0].content).toBe("Body content here");
  });

  it("throws on files without valid frontmatter", async () => {
    const postsDir = path.join(tmpDir, "blog/posts");
    fs.mkdirSync(postsDir, { recursive: true });
    fs.writeFileSync(
      path.join(postsDir, "bad-file.mdx"),
      "no frontmatter here",
    );

    await expect(store.readAllRaw()).rejects.toThrow(
      "Invalid frontmatter in bad-file.mdx",
    );
  });

  it("throws when the posts directory does not exist", async () => {
    await expect(store.readAllRaw()).rejects.toThrow(
      "No data found in the data directory",
    );
  });
});

describe("JsonFilesystemStorage with schema validation", () => {
  let tmpDir: string;
  let store: JsonFilesystemStorage<ImageAsset>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "fs-test-"));
    const storage = new FilesystemStorage({ rootDir: tmpDir });
    store = storage.forJSON<ImageAsset>({
      pathPrefix: "assets/images",
      schema: ImageAssetSchema,
    });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes valid data successfully", async () => {
    const asset: ImageAsset = {
      slug: "test-image",
      title: "Test Image",
      description: "A test image",
      contentType: "image/jpeg",
      width: 800,
      height: 600,
      url: "https://example.com/images/test.jpg",
    };

    await store.writeAll([asset]);
    const results = await store.readAll();

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject(asset);
  });

  it("throws on write when data is invalid", async () => {
    // Invalid: missing required fields and invalid URL
    const invalidAsset = {
      slug: "", // empty slug - invalid
      title: "Test",
      description: "", // empty description - invalid
      contentType: "image/jpeg",
      width: -100, // negative width - invalid
      height: 600,
      url: "not-a-valid-url", // invalid URL - missing protocol
    };

    await expect(
      store.writeAll([invalidAsset as ImageAsset]),
    ).rejects.toThrow();
  });

  it("throws on read when stored data is invalid", async () => {
    // Write a JSON file manually with invalid data (missing required fields)
    const assetsDir = path.join(tmpDir, "assets/images");
    fs.mkdirSync(assetsDir, { recursive: true });
    const invalidJson = JSON.stringify({
      slug: "", // empty slug
      title: "Test",
      description: "Desc",
      contentType: "image/jpeg",
      width: 100,
      height: 100,
      url: "https://example.com/image.jpg",
    });
    fs.writeFileSync(path.join(assetsDir, "invalid.json"), invalidJson);

    await expect(store.readAll()).rejects.toThrow();
  });

  it("validates URL format on write", async () => {
    const assetWithInvalidUrl = {
      slug: "test",
      title: "Test",
      description: "Desc",
      contentType: "image/jpeg",
      width: 100,
      height: 100,
      url: "not-a-url", // Missing protocol - invalid
    };

    await expect(
      store.writeAll([assetWithInvalidUrl as ImageAsset]),
    ).rejects.toThrow(/URL must be a valid URL/i);
  });

  it("validates positive numbers for width and height", async () => {
    const assetWithNegativeDimensions = {
      slug: "test",
      title: "Test",
      description: "Desc",
      contentType: "image/jpeg",
      width: -100, // negative - invalid
      height: 200,
      url: "https://example.com/image.jpg",
    };

    await expect(
      store.writeAll([assetWithNegativeDimensions as ImageAsset]),
    ).rejects.toThrow(/Width must be a positive number/i);
  });
});
