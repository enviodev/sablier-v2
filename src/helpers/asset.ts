import { AssetEntity } from "../src/Types.gen";
import { getTokenInfo } from "../contracts/erc20";

// This function is only called on CreateLockupLinearStream or CreateLockupDynamicStream
export async function createAsset(
  assetAddress: string,
  chainId: bigint
): Promise<AssetEntity> {
  let { name, symbol, decimals } = await getTokenInfo(assetAddress);

  const assetEntity: AssetEntity = {
    id: assetAddress.toLowerCase(),
    address: assetAddress.toLowerCase(),
    chainId: chainId,
    name: name,
    symbol: symbol,
    decimals: BigInt(decimals),
  };

  return assetEntity;
}
