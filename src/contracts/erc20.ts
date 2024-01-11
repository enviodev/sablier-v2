import { ethers } from "ethers";

const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
  "https://rpc.ankr.com/eth"
);

type tokenData = { decimals: number; name: string; symbol: string };

export async function getTokenInfo(
  contractAddress: string
): Promise<tokenData> {
  try {
    const contract = new ethers.Contract(
      ethers.getAddress(contractAddress),
      [
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function name() view returns (string)",
      ],
      provider
    );

    const tokenName = await contract.name();

    const tokenSymbol = await contract.symbol();

    const decimals = await contract.decimals();

    return { decimals: decimals, name: tokenName, symbol: tokenSymbol };
  } catch (error) {
    console.error("Error fetching token information:", error);
    return { decimals: 0, name: "unknown", symbol: "unknown" };
  }
}
