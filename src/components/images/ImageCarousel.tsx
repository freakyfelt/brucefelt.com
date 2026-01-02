import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ReactNode } from "react";
import { ContentfulImage } from "./ContentfulImage";
import { getImageById } from "@/lib/data/assets";

export async function ImageCarouselItem({ assetId }: { assetId: string }) {
  const asset = await getImageById(assetId);

  if (!asset) return null;

  return (
    <CarouselItem>
      <ContentfulImage asset={asset} className="object-contain" />
      {(asset.title || asset.description) && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {asset.title && <p className="font-medium">{asset.title}</p>}
          {asset.description && <p>{asset.description}</p>}
        </div>
      )}
    </CarouselItem>
  );
}

export function ImageCarousel({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 px-12">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>{children}</CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  );
}
