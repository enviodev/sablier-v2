import {
  eventLog,
  ContractEntity,
  SablierV2LockupLinearContract_TransferAdminEvent_eventArgs,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

export function createContract(
  address: string,
  category: string
): ContractEntity {
  const contractEntity: ContractEntity = {
    id: address,
    // TODO update the contract alias to the correct one
    alias: address,
    // TODO update this admin value to the correct one
    admin: "admin",
    address: address,
    category: category,
  };

  return contractEntity;
}

export function upgradeContractAdminInfo(
  event: eventLog<SablierV2LockupLinearContract_TransferAdminEvent_eventArgs>,
  contractEntity: ContractEntity
): ContractEntity {
  return {
    ...contractEntity,
    admin: event.params.newAdmin,
  };
}
