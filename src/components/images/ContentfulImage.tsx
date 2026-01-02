import { ImageAsset } from "@/interfaces/image-asset";
import Image from "next/image";
import { getImageById } from "@/lib/data/assets";

export type ContentfulImageProps = (
  | {
      asset: ImageAsset;
      assetId?: never;
    }
  | {
      asset?: never;
      assetId: string;
    }
) & {
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export async function ContentfulImage({
  asset: providedAsset,
  assetId,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px",
  priority = false,
  width,
  height,
}: ContentfulImageProps) {
  const asset = providedAsset || (assetId ? await getImageById(assetId) : null);

  if (!asset) {
    return null;
  }

  const baseUrl = asset.url.startsWith("//") ? `https:${asset.url}` : asset.url;

  const finalHeight =
    height || (width ? Math.round(asset.height * (width / asset.width)) : 1000);
  const finalWidth =
    width || Math.round(asset.width * (finalHeight / asset.height));

  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (!width && !height) params.set("h", "1000");
  // params.set("q", "75");
  params.set("fm", "webp");

  const src = `${baseUrl}?${params.toString()}`;

  return (
    <Image
      src={src}
      alt={asset.title || asset.description || ""}
      width={finalWidth}
      height={finalHeight}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
