import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { FilesystemStorage, MdxFilesystemStorage } from "./filesystem";
import { RawPost, Post } from "@/interfaces/post";

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
