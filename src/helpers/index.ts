interface ChainInfo {
  chainId: number;
  chainName: string;
  aliasKey: string;
  version: string;
}

interface AddressToChainMapping {
  [address: string]: ChainInfo;
}

const addressToChainMapping: AddressToChainMapping = {
  // Mainnet (SablierV2LockupLinear)
  "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ll",
    version: "v21",
  },
  // Arbitrum One (SablierV2LockupLinear)
  "0xfdd9d122b451f549f48c4942c6fa6646d849e8c1": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ll",
    version: "v21",
  },
  // Base (SablierV2LockupLinear)
  "0xfcf737582d167c7d20a336532eb8bcca8cf8e350": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ll",
    version: "v21",
  },
  // BNB Smart Chain (SablierV2LockupLinear)
  "0x14c35e126d75234a90c9fb185bf8ad3edb6a90d2": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ll",
    version: "v21",
  },
  // Gnosis (SablierV2LockupLinear)
  "0xce49854a647a1723e8fb7cc3d190cab29a44ab48": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ll",
    version: "v21",
  },
  // Optimism (SablierV2LockupLinear)
  "0x4b45090152a5731b5bc71b5baf71e60e05b33867": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ll",
    version: "v21",
  },
  // Polygon (SablierV2LockupLinear)
  "0x5f0e1dea4a635976ef51ec2a2ed41490d1eba003": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ll",
    version: "v21",
  },
  // Scroll (SablierV2LockupLinear)
  "0x57e14ab4dad920548899d86b54ad47ea27f00987": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ll",
    version: "v21",
  },
  // Mainnet (SablierV2LockupDynamic)
  "0x7cc7e125d83a581ff438608490cc0f7bdff79127": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ld",
    version: "v21",
  },
  // Arbitrum One (SablierV2LockupDynamic)
  "0xf390ce6f54e4dc7c5a5f7f8689062b7591f7111d": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ld",
    version: "v21",
  },
  // Arbitrum Nova (SablierV2LockupDynamic)
  "0xd6b66a8d797c1e83ddece8f483e7d1264b9dfda6": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ld",
    version: "v21",
  },
  // Base (SablierV2LockupDynamic)
  "0x461e13056a3a3265cef4c593f01b2e960755de91": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ld",
    version: "v21",
  },
  // BNB Smart Chain (SablierV2LockupDynamic)
  "0xf900c5e3aa95b59cc976e6bc9c0998618729a5fa": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ld",
    version: "v21",
  },
  // Gnosis (SablierV2LockupDynamic)
  "0x1df83c7682080b0f0c26a20c6c9cb8623e0df24e": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ld",
    version: "v21",
  },
  // Optimism (SablierV2LockupDynamic)
  "0xd6920c1094eabc4b71f3dc411a1566f64f4c206e": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ld",
    version: "v21",
  },
  // Polygon (SablierV2LockupDynamic)
  "0xb194c7278c627d52e440316b74c5f24fc70c1565": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ld",
    version: "v21",
  },
  // Scroll (SablierV2LockupDynamic)
  "0xaaff2d11f9e7cd2a9cdc674931fac0358a165995": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ld",
    version: "v21",
  },
};

// Function to get chainId or chainName for a given address
export function getChainInfoForAddress(address: string): ChainInfo {
  const lowercaseAddress = address.toLowerCase();
  // Check if the address exists in the mapping
  if (addressToChainMapping.hasOwnProperty(lowercaseAddress)) {
    // Return the corresponding chain information
    return addressToChainMapping[lowercaseAddress];
  } else {
    // Return default value if address is not found
    return {
      chainId: 0,
      chainName: "unknown",
      aliasKey: "unknown",
      version: "unknown",
    };
  }
}
