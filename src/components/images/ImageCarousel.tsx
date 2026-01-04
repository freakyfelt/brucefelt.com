import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ReactNode } from "react";
import { ImageItem } from "./ImageItem";
import { getImageById } from "@/lib/data/assets";

export async function ImageCarouselItem({ assetId }: { assetId: string }) {
  const asset = await getImageById(assetId);

  return (
    <CarouselItem>
      <ImageItem asset={asset} height={500} />
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
