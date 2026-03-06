import { z } from "zod";

export const ImageAssetSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentType: z.string().min(1, "Content type is required"),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  url: z.url("URL must be a valid URL"),
});

export type ImageAsset = z.infer<typeof ImageAssetSchema>;
