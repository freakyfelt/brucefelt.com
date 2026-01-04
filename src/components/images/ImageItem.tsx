import {
  Item,
  ItemHeader,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { ContentfulImage, ContentfulImageProps } from "./ContentfulImage";
import { cn } from "@/lib/utils";

export type ImageItemProps = ContentfulImageProps & {
  /**
   * Whether to show the caption (title and description).
   * @default true
   */
  showCaption?: boolean;
};

export function ImageItem({
  asset,
  showCaption = true,
  className, // Passed to ContentfulImage
  ...imageProps
}: ImageItemProps) {
  const { height } = imageProps;

  return (
    <Item
      className="flex-col gap-0 p-0 border-0 w-full md:w-fit mx-auto"
      style={
        {
          "--image-height": height ? `${height}px` : undefined,
        } as React.CSSProperties
      }
    >
      <ItemHeader className="basis-auto">
        <ContentfulImage
          asset={asset}
          className={cn(
            "rounded-lg border bg-muted overflow-hidden",
            height &&
              "w-full md:w-auto max-h-[70vh] md:max-h-[var(--image-height)]",
            className,
          )}
          {...imageProps}
        />
      </ItemHeader>
      {showCaption && (asset.title || asset.description) && (
        <ItemContent className="mt-2 text-center px-4 pb-4">
          {asset.title && (
            <ItemTitle className="justify-center">{asset.title}</ItemTitle>
          )}
          {asset.description && (
            <ItemDescription>{asset.description}</ItemDescription>
          )}
        </ItemContent>
      )}
    </Item>
  );
}
