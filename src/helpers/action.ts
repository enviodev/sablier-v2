import {
  eventLog,
  ActionEntity,
  WatcherEntity,
  SablierV2LockupContract_ApprovalEvent_eventArgs,
  SablierV2LockupContract_ApprovalForAllEvent_eventArgs,
  SablierV2LockupContract_CancelLockupStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs,
  SablierV2LockupContract_RenounceLockupStreamEvent_eventArgs,
  SablierV2LockupContract_TransferEvent_eventArgs,
  SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs,
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
  contract_address: string
): ActionEntity {
  let id = generateActionId(event);
  let actionEntity: ActionEntity = {
    id: id,
    block: BigInt(event.blockNumber),
    from: event.srcAddress.toString().toLowerCase(),
    hash: event.transactionHash.toString(),
    timestamp: BigInt(event.blockTimestamp),
    subgraphId: watcher.actionIndex,
    chainId: BigInt(getChainInfoForAddress(event.srcAddress).chainId),
    contract: contract_address.toLowerCase(),
    addressA: "",
    addressB: "",
    amountA: 0n,
    amountB: 0n,
    stream: null,
    category: actionType,
  };

  return actionEntity;
}
export function createApprovalAction(
  event: eventLog<SablierV2LockupContract_ApprovalEvent_eventArgs>,
  watcher: WatcherEntity,
  contract_address: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Approval",
    event,
    watcher,
    contract_address
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.owner.toLowerCase(),
    addressB: event.params.approved, // todo: verify this is not a bug
  };

  return actionEntity;
}

export function createApprovalForAllAction(
  event: eventLog<SablierV2LockupContract_ApprovalForAllEvent_eventArgs>,
  watcher: WatcherEntity,
  contract_address: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "ApprovalForAll",
    event,
    watcher,
    contract_address
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.owner.toLowerCase(),
    addressB: event.params.operator.toLowerCase(),
    amountA: event.params.approved ? 1n : 0n,
  };

  return actionEntity;
}

export function createCancelAction(
  event: eventLog<SablierV2LockupContract_CancelLockupStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract_address: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Cancel",
    event,
    watcher,
    contract_address
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.sender.toLowerCase(),
    addressB: event.params.recipient.toLowerCase(),
    amountA: event.params.senderAmount,
    amountB: event.params.recipientAmount,
  };

  return actionEntity;
}

export function createCreateAction(
  event: eventLog<
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs
  >,
  watcher: WatcherEntity,
  contract_address: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Create",
    event,
    watcher,
    contract_address
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.sender.toLowerCase(),
    addressB: event.params.recipient.toLowerCase(),
    amountA: event.params.amounts[0],
  };

  return actionEntity;
}

export function createRenounceAction(
  event: eventLog<SablierV2LockupContract_RenounceLockupStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contractAddress: string
): ActionEntity {
  let actionEntity: ActionEntity = createAction(
    "Renounce",
    event,
    watcher,
    contractAddress
  );
  return actionEntity;
}

export function createTransferAction(
  event: eventLog<SablierV2LockupContract_TransferEvent_eventArgs>,
  watcher: WatcherEntity,
  contractAddress: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Transfer",
    event,
    watcher,
    contractAddress
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.params.from.toLowerCase(),
    addressB: event.params.to.toLowerCase(),
  };

  return actionEntity;
}

export function createWithdrawAction(
  event: eventLog<SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract_address: string
): ActionEntity {
  let partialActionEntity: ActionEntity = createAction(
    "Withdraw",
    event,
    watcher,
    contract_address
  );

  let actionEntity: ActionEntity = {
    ...partialActionEntity,
    addressA: event.srcAddress.toString().toLowerCase(),
    addressB: event.params.to.toLowerCase(),
    amountB: event.params.amount,
  };

  return actionEntity;
}

export function updateActionStreamInfo(
  streamId: string,
  action: ActionEntity
): ActionEntity {
  return {
    ...action,
    stream: streamId,
  };
}
