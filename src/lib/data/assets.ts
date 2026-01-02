import { ImageAsset } from "@/interfaces/image-asset";
import { appContext } from "@/lib/app/context";

export const getImageById = async (
  assetId: string,
): Promise<ImageAsset | null> => {
  return appContext.stores.contentfulAssets.read(assetId);
};
