"use client";

import { ImageAsset } from "@/interfaces/image-asset";
import Image, { ImageLoaderProps } from "next/image";
import { cn } from "@/lib/utils";

const MAX_WIDTH = 2560;

export type ContentfulImageProps = {
  asset: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * Optional override for width. If not provided, asset.width is used.
   * Ignored if 'fill' is true.
   */
  width?: number;
  /**
   * Optional override for height. If not provided, asset.height is used.
   * Ignored if 'fill' is true.
   */
  height?: number;
  /**
   * If true, the image will fill its parent container.
   * Parent must have 'position: relative', 'position: fixed', or 'position: absolute'.
   */
  fill?: boolean;
  /**
   * Optional override for alt text.
   */
  alt?: string;
  /**
   * Object-fit property when using 'fill' mode.
   * @default 'contain'
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL(src);
  url.searchParams.set("w", Math.min(MAX_WIDTH, width).toString());
  url.searchParams.set("q", (quality || 75).toString());
  url.searchParams.set("fm", "webp");
  return url.toString();
};

export function ContentfulImage({
  asset,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px",
  priority = false,
  width,
  height,
  fill = false,
  alt,
  objectFit = "contain",
}: ContentfulImageProps) {
  const baseUrl = asset.url.startsWith("//") ? `https:${asset.url}` : asset.url;

  // Base URL for the src attribute fallback
  const srcUrl = new URL(baseUrl);
  srcUrl.searchParams.set("fm", "webp");
  srcUrl.searchParams.set("q", "75");
  srcUrl.searchParams.set("w", (width || asset.width || 1024).toString());

  // Determine dimensions for next/image props (used for aspect ratio and loader)
  const displayWidth =
    width ||
    (height ? Math.round((asset.width / asset.height) * height) : asset.width);
  const displayHeight =
    height ||
    (width ? Math.round((asset.height / asset.width) * width) : asset.height);

  return (
    <Image
      src={srcUrl.toString()}
      alt={alt || asset.title || asset.description || ""}
      loader={imageLoader}
      className={cn(!fill && "max-w-full h-auto", className)}
      sizes={sizes}
      priority={priority}
      fill={fill}
      width={fill ? undefined : displayWidth}
      height={fill ? undefined : displayHeight}
      style={{
        objectFit: fill ? objectFit : undefined,
        aspectRatio: fill ? undefined : `${asset.width} / ${asset.height}`,
      }}
    />
  );
}
