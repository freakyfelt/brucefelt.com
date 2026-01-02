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
    <CarouselItem className="basis-1/3">
      <figure className="flex flex-col h-full">
        <div className="mx-auto w-fit max-w-full overflow-hidden rounded-lg border bg-muted">
          <ContentfulImage asset={asset} height={500} />
        </div>
        {(asset.title || asset.description) && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {asset.title && <p className="font-medium">{asset.title}</p>}
            {asset.description && <p>{asset.description}</p>}
          </figcaption>
        )}
      </figure>
    </CarouselItem>
  );
}

export function ImageCarousel({ children }: { children: ReactNode }) {
  return (
    <section className="my-8 px-12" aria-label="Image Gallery">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>{children}</CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </section>
  );
}
