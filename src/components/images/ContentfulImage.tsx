import { Asset } from "@/interfaces/asset";
import Image from "next/image";
import { getImageById } from "@/lib/data/assets";

export type ContentfulImageProps =
  | {
      asset: Asset;
      assetId?: never;
      className?: string;
      sizes?: string;
      priority?: boolean;
    }
  | {
      asset?: never;
      assetId: string;
      className?: string;
      sizes?: string;
      priority?: boolean;
    };

export async function ContentfulImage({
  asset: providedAsset,
  assetId,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px",
  priority = false,
}: ContentfulImageProps) {
  const asset = providedAsset || (assetId ? await getImageById(assetId) : null);

  if (!asset) {
    return null;
  }

  const src = asset.large.startsWith("//")
    ? `https:${asset.large}`
    : asset.large;

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-lg border bg-muted"
      style={{
        height: "500px",
        aspectRatio: `${asset.width} / ${asset.height}`,
      }}
    >
      <Image
        src={src}
        alt={asset.title || asset.description || ""}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
