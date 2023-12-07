import { AssetEntity } from "../src/Types.gen";

// This function is only called on CreateLockupLinearStream or CreateLockupDynamicStream
export function createAsset(
  assetAddress: string,
  chainId: bigint
): AssetEntity {
  const assetEntity: AssetEntity = {
    id: assetAddress,
    address: assetAddress,
    chainId: chainId,
  };

  return assetEntity;
}
