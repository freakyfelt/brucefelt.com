import { ImageAsset } from "@/interfaces/image-asset";
import { appContext } from "@/lib/app/context";

export const staticImageAssets = {
  self: "5X0ig9hXwUzwXITz03HOS1",
} as const;

export const getImageById = async (
  assetId: string,
): Promise<ImageAsset | null> => {
  return appContext.stores.imageAssets.read(assetId);
};
