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
  "0xb10daee1fcf62243ae27776d7a92d39dc8740f95": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ll",
    version: "V20",
  },
  // Arbitrum One (SablierV2LockupLinear)
  "0x197d655f3be03903fd25e7828c3534504bfe525e": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ll",
    version: "V20",
  },
  // Arbitrum Nova (SablierV2LockupLinear)
  "0x18306c9550abfe3f5900d1206ffdce9ce5763a89": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ll",
    version: "V20",
  },
  // Avalanche (SablierV2LockupLinear)
  "0x610346e9088afa70d6b03e96a800b3267e75ca19": {
    chainId: 43114,
    chainName: "avalanche",
    aliasKey: "ll",
    version: "V20",
  },
  // Base (SablierV2LockupLinear)
  "0x6b9a46c8377f21517e65fa3899b3a9fab19d17f5": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ll",
    version: "V20",
  },
  // BNB Smart Chain (SablierV2LockupLinear)
  "0x3fe4333f62a75c2a85c8211c6aefd1b9bfde6e51": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ll",
    version: "V20",
  },
  // Gnosis (SablierV2LockupLinear)
  "0x685e92c9ca2bb23f1b596d0a7d749c0603e88585": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ll",
    version: "V20",
  },
  // Optimism (SablierV2LockupLinear)
  "0xb923abdca17aed90eb5ec5e407bd37164f632bfd": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ll",
    version: "V20",
  },
  // Polygon (SablierV2LockupLinear)
  "0x67422c3e36a908d5c3237e9cffeb40bde7060f6e": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ll",
    version: "V20",
  },
  // Scroll (SablierV2LockupLinear)
  "0x80640ca758615ee83801ec43452feea09a202d33": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ll",
    version: "V20",
  },
  // Mainnet (SablierV2LockupDynamic)
  "0x39efdc3dbb57b2388ccc4bb40ac4cb1226bc9e44": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ld",
    version: "V20",
  },
  // Arbitrum One (SablierV2LockupDynamic)
  "0xa9efbef1a35ff80041f567391bdc9813b2d50197": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ld",
    version: "V20",
  },
  // Arbitrum Nova (SablierV2LockupDynamic)
  "0xd6b66a8d797c1e83ddECE8f483E7D1264B9DFDa6": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ld",
    version: "V20",
  },
  // Avalanche (SablierV2LockupDynamic)
  "0x665d1c8337f1035cFbe13DD94bB669110b975f5f": {
    chainId: 43114,
    chainName: "avalanche",
    aliasKey: "ld",
    version: "V20",
  },
  // Base (SablierV2LockupDynamic)
  "0x645b00960dc352e699f89a81fc845c0c645231cf": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ld",
    version: "V20",
  },
  // BNB Smart Chain (SablierV2LockupDynamic)
  "0xf2f3fef2454dca59eca929d2d8cd2a8669cc6214": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ld",
    version: "V20",
  },
  // Gnosis (SablierV2LockupDynamic)
  "0xeb148e4ec13aaA65328c0BA089a278138E9E53F9": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ld",
    version: "V20",
  },
  // Optimism (SablierV2LockupDynamic)
  "0x6f68516c21e248cddfaf4898e66b2b0adee0e0d6": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ld",
    version: "V20",
  },
  // Polygon (SablierV2LockupDynamic)
  "0x7313addb53f96a4f710d3b91645c62b434190725": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ld",
    version: "V20",
  },
  // Scroll (SablierV2LockupDynamic)
  "0xde6a30d851efd0fc2a9c922f294801cfd5fcb3a1": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ld",
    version: "V20",
  },
  // Mainnet (SablierV2LockupLinear)
  "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ll2",
    version: "V21",
  },
  // Arbitrum One (SablierV2LockupLinear)
  "0xfdd9d122b451f549f48c4942c6fa6646d849e8c1": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ll2",
    version: "V21",
  },
  // Base (SablierV2LockupLinear)
  "0xfcf737582d167c7d20a336532eb8bcca8cf8e350": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ll2",
    version: "V21",
  },
  // BNB Smart Chain (SablierV2LockupLinear)
  "0x14c35e126d75234a90c9fb185bf8ad3edb6a90d2": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ll2",
    version: "V21",
  },
  // Gnosis (SablierV2LockupLinear)
  "0xce49854a647a1723e8fb7cc3d190cab29a44ab48": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ll2",
    version: "V21",
  },
  // Optimism (SablierV2LockupLinear)
  "0x4b45090152a5731b5bc71b5baf71e60e05b33867": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ll2",
    version: "V21",
  },
  // Polygon (SablierV2LockupLinear)
  "0x5f0e1dea4a635976ef51ec2a2ed41490d1eba003": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ll2",
    version: "V21",
  },
  // Scroll (SablierV2LockupLinear)
  "0x57e14ab4dad920548899d86b54ad47ea27f00987": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ll2",
    version: "V21",
  },
  // Mainnet (SablierV2LockupDynamic)
  "0x7cc7e125d83a581ff438608490cc0f7bdff79127": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ld2",
    version: "V21",
  },
  // Arbitrum One (SablierV2LockupDynamic)
  "0xf390ce6f54e4dc7c5a5f7f8689062b7591f7111d": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ld2",
    version: "V21",
  },
  // Arbitrum Nova (SablierV2LockupDynamic)
  "0xd6b66a8d797c1e83ddece8f483e7d1264b9dfda6": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ld2",
    version: "V21",
  },
  // Base (SablierV2LockupDynamic)
  "0x461e13056a3a3265cef4c593f01b2e960755de91": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ld2",
    version: "V21",
  },
  // BNB Smart Chain (SablierV2LockupDynamic)
  "0xf900c5e3aa95b59cc976e6bc9c0998618729a5fa": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ld2",
    version: "V21",
  },
  // Gnosis (SablierV2LockupDynamic)
  "0x1df83c7682080b0f0c26a20c6c9cb8623e0df24e": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ld2",
    version: "V21",
  },
  // Optimism (SablierV2LockupDynamic)
  "0xd6920c1094eabc4b71f3dc411a1566f64f4c206e": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ld2",
    version: "V21",
  },
  // Polygon (SablierV2LockupDynamic)
  "0xb194c7278c627d52e440316b74c5f24fc70c1565": {
    chainId: 137,
    chainName: "polygon",
    aliasKey: "ld2",
    version: "V21",
  },
  // Scroll (SablierV2LockupDynamic)
  "0xaaff2d11f9e7cd2a9cdc674931fac0358a165995": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ld2",
    version: "V21",
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
