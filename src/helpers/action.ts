import {
  StreamEntity,
  ContractEntity,
  eventLog,
  ActionEntity,
  WatcherEntity,
  SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs,
} from "../src/Types.gen";

import { getChainId } from "./index";

export function generateActionId(event: eventLog<any>): string {
  return ""
    .concat(event.transactionHash.toString())
    .concat("-")
    .concat(event.logIndex.toString());
}

function createAction(
  actionType: string,
  event: eventLog<any> | eventLog<any>,
  watcher: WatcherEntity,
  contract: ContractEntity
): ActionEntity {
  let id = generateActionId(event);
  let actionEntity: ActionEntity = {
    id: id,
    block: BigInt(event.blockNumber),
    from: event.srcAddress.toString(),
    hash: event.transactionHash.toString(),
    timestamp: BigInt(event.blockTimestamp),
    subgraphId: watcher.actionIndex,
    chainId: getChainId(),
    contract: contract.id,
    addressA: "",
    addressB: "",
    amountA: 0n,
    amountB: 0n,
    stream: null,
    category: actionType,
  };

  return actionEntity;
}

export function createCreateAction(
  event: eventLog<SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Create",
    event,
    watcher,
    contract
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    category: "Create",
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.amounts[0],
  };

  return actionEntity;
}

export function updateActionStreamInfo(
  stream: StreamEntity,
  action: ActionEntity
): ActionEntity {
  return {
    ...action,
    stream: stream.id,
  };
}
