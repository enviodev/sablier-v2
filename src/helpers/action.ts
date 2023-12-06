import {
  StreamEntity,
  ContractEntity,
  eventLog,
  ActionEntity,
  WatcherEntity,
  SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs,
  SablierV2LockupLinearContract_CancelLockupStreamEvent_eventArgs,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

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
    chainId: BigInt(getChainInfoForAddress(event.srcAddress).chainId),
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
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.amounts[0],
  };

  return actionEntity;
}

export function createCancelAction(
  event: eventLog<SablierV2LockupLinearContract_CancelLockupStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Cancel",
    event,
    watcher,
    contract
  );

  /** --------------- */

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.senderAmount,
    amountB: event.params.recipientAmount,
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
