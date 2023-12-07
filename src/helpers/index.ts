interface ChainInfo {
  chainId: number;
  chainName: string;
  aliasKey: string;
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
  },
  // Arbitrum One (SablierV2LockupLinear)
  "0x197d655f3be03903fd25e7828c3534504bfe525e": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ll",
  },
  // Arbitrum Nova (SablierV2LockupLinear)
  "0x18306c9550abfe3f5900d1206ffdce9ce5763a89": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ll",
  },
  // Avalanche (SablierV2LockupLinear)
  "0x610346e9088afa70d6b03e96a800b3267e75ca19": {
    chainId: 43114,
    chainName: "avalanche",
    aliasKey: "ll",
  },
  // Base (SablierV2LockupLinear)
  "0x6b9a46c8377f21517e65fa3899b3a9fab19d17f5": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ll",
  },
  // BNB Smart Chain (SablierV2LockupLinear)
  "0x3fe4333f62a75c2a85c8211c6aefd1b9bfde6e51": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ll",
  },
  // Gnosis (SablierV2LockupLinear)
  "0x685e92c9ca2bb23f1b596d0a7d749c0603e88585": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ll",
  },
  // Optimism (SablierV2LockupLinear)
  "0xb923abdca17aed90eb5ec5e407bd37164f632bfd": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ll",
  },
  // Polygon (SablierV2LockupLinear)
  "0x67422c3e36a908d5c3237e9cffeb40bde7060f6e": {
    chainId: 137,
    chainName: "matic",
    aliasKey: "ll",
  },
  // Scroll (SablierV2LockupLinear)
  "0x80640ca758615ee83801ec43452feea09a202d33": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ll",
  },
  // Mainnet (SablierV2LockupDynamic)
  "0x39efdc3dbb57b2388cc4bb40ac4cb1226bc9e44": {
    chainId: 1,
    chainName: "mainnet",
    aliasKey: "ld",
  },
  // Arbitrum One (SablierV2LockupDynamic)
  "0xa9efbef1a35ff80041f567391bdc9813b2d50197": {
    chainId: 42161,
    chainName: "arbitrum-one",
    aliasKey: "ld",
  },
  // Arbitrum Nova (SablierV2LockupDynamic)
  "0xd6b66a8d797c1e83ddECE8f483E7D1264B9DFDa6": {
    chainId: 42170,
    chainName: "arbitrum-nova",
    aliasKey: "ld",
  },
  // Avalanche (SablierV2LockupDynamic)
  "0x665d1c8337f1035cFbe13DD94bB669110b975f5f": {
    chainId: 43114,
    chainName: "avalanche",
    aliasKey: "ld",
  },
  // Base (SablierV2LockupDynamic)
  "0x645b00960dc352e699f89a81fc845c0c645231cf": {
    chainId: 8453,
    chainName: "base",
    aliasKey: "ld",
  },
  // BNB Smart Chain (SablierV2LockupDynamic)
  "0xf2f3fef2454dca59eca929d2d8cd2a8669cc6214": {
    chainId: 56,
    chainName: "bsc",
    aliasKey: "ld",
  },
  // Gnosis (SablierV2LockupDynamic)
  "0xeb148e4ec13aaA65328c0BA089a278138E9E53F9": {
    chainId: 100,
    chainName: "gnosis",
    aliasKey: "ld",
  },
  // Optimism (SablierV2LockupDynamic)
  "0x6f68516c21e248cddfaf4898e66b2b0adee0e0d6": {
    chainId: 10,
    chainName: "optimism",
    aliasKey: "ld",
  },
  // Polygon (SablierV2LockupDynamic)
  "0x7313addb53f96a4f710d3b91645c62b434190725": {
    chainId: 137,
    chainName: "matic",
    aliasKey: "ld",
  },
  // Scroll (SablierV2LockupDynamic)
  "0xde6a30d851efd0fc2a9c922f294801cfd5fcb3a1": {
    chainId: 534352,
    chainName: "scroll",
    aliasKey: "ld",
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
    };
  }
}

// Testing function
// const exampleAddress: string = '0x197d655f3be03903fd25e7828c3534504bfe525e';
// const chainInfo = getChainInfoForAddress(exampleAddress);

// if (chainInfo !== null) {
//   console.log(`Chain ID for ${exampleAddress}: ${chainInfo.chainId}`);
//   console.log(`Chain Name for ${exampleAddress}: ${chainInfo.chainName}`);
// } else {
//   console.log(`Chain information not found for ${exampleAddress}`);
// }
