import { Asset } from "@/interfaces/asset";
import { appContext } from "@/lib/app/context";

export const getImageById = async (assetId: string): Promise<Asset | null> => {
  return appContext.stores.contentfulAssets.read(assetId);
};
