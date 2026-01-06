import { Tag } from "@/interfaces/tag";

export const mockTags: Tag[] = [
  { displayName: "Tag 1", slug: "tag-1", description: "Desc" },
];

export const mockContentfulPostMetadata = {
  slug: "post-1",
  tagsCollection: {
    items: mockTags,
  },
};

export const mockContentfulPost = {
  title: "Post 1",
  slug: "post-1",
  content:
    "Content with some text\n\n> [!IMAGE_GALLERY]\n> ![Img](//images.ctfassets.net/s/id1/v/i.jpg)\n",
  publishDate: "2024-01-01",
  description: "Excerpt",
  status: "active",
  tagsCollection: {
    items: [{ slug: "tag-1" }],
  },
};

export const mockContentfulAssets = [
  {
    sys: { id: "id1" },
    title: "f.jpg",
    description: "desc",
    contentType: "image/jpeg",
    width: 100,
    height: 100,
    url: "url1",
  },
  {
    sys: { id: "5X0ig9hXwUzwXITz03HOS1" },
    title: "static.jpg",
    description: "static desc",
    contentType: "image/jpeg",
    width: 200,
    height: 200,
    url: "static-url",
  },
];
