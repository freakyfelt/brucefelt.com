import { z } from "zod";

export const TagSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
});

export type Tag = z.infer<typeof TagSchema>;
