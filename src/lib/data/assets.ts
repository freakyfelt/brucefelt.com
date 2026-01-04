import { ImageAsset } from "@/interfaces/image-asset";
import { appContext } from "@/lib/app/context";

export const staticImageAssets = {
  self: "5X0ig9hXwUzwXITz03HOS1",
} as const;

export const getImageById = async (assetId: string): Promise<ImageAsset> => {
  const asset = await appContext.stores.imageAssets.read(assetId);
  if (!asset) {
    throw new Error(`Asset with id ${assetId} not found`);
  }
  return asset;
};
