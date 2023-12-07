import {
  eventLog,
  ContractEntity,
  SablierV2LockupContract_TransferAdminEvent_eventArgs,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

export function createContract(address: string): ContractEntity {
  let chainInfo = getChainInfoForAddress(address);

  const contractEntity: ContractEntity = {
    id: address,
    alias: chainInfo.aliasKey + "-" + address,
    chainId: BigInt(chainInfo.chainId),
    chainName: chainInfo.chainName,
    // TODO update this admin value to the correct one
    admin: "admin",
    address: address,
    category: getContractCategory(chainInfo.aliasKey),
  };

  return contractEntity;
}

export function upgradeContractAdminInfo(
  event: eventLog<SablierV2LockupContract_TransferAdminEvent_eventArgs>,
  contractEntity: ContractEntity
): ContractEntity {
  return {
    ...contractEntity,
    admin: event.params.newAdmin,
  };
}

function getContractCategory(alias: string): string {
  if (alias == "ll") {
    return "LockupLinear";
  } else if (alias == "ld") {
    return "LockupDynamic";
  } else {
    return "Unknown";
  }
}
