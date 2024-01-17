import { ethers } from "ethers";
import { Cache } from "../lib/cache";
import { hash } from "../lib/hash";

const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
  "https://rpc.ankr.com/eth"
);

type tokenData = { decimals: number; name: string; symbol: string };

export async function getTokenInfo(
  contractAddress: string
): Promise<tokenData> {
  try {
    const erc20Abi = [
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
      "function name() view returns (string)",
    ];

    const contract = new ethers.Contract(
      ethers.getAddress(contractAddress),
      erc20Abi,
      provider
    );

    const cache = new Cache();

    const hashOfNameRequest = hash({
      params: contractAddress,
      method: "name", // todo: find way to get a function signature in js/ts
      abi: erc20Abi,
      provider: provider,
    }); // unique id for this request, todo: explore simpler options

    const tokenName = await cache.getFromCacheOrMakeRequest(
      hashOfNameRequest,
      contract.name
    );

    const hashOfSymbolRequest = hash({
      params: contractAddress,
      method: "symbol", // todo: find way to get a function signature in js/ts
      abi: erc20Abi,
      provider: provider,
    });

    const tokenSymbol = await cache.getFromCacheOrMakeRequest(
      hashOfSymbolRequest,
      contract.symbol
    );

    const hashOfDecimalsRequest = hash({
      params: contractAddress,
      method: "decimals", // todo: find way to get a function signature in js/ts
      abi: erc20Abi,
      provider: provider,
    });

    const tokenDecimals = await cache.getFromCacheOrMakeRequest(
      hashOfDecimalsRequest,
      contract.decimals
    );

    return { decimals: tokenDecimals, name: tokenName, symbol: tokenSymbol };
  } catch (error) {
    console.error("Error fetching token information:", error);
    return { decimals: 0, name: "unknown", symbol: "unknown" };
  }
}
