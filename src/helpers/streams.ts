import {
  eventLog,
  ActionEntity,
  ContractEntity,
  StreamEntity,
  WatcherEntity,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs,
  SablierV2LockupContract_TransferEvent_eventArgs,
  SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs,
  AssetEntity,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

import { add, div, minus, mul } from "./maths";

export function generateStreamId(
  contractAddress: string,
  tokenId: bigint
): string {
  let id = ""
    .concat(contractAddress)
    .toLowerCase()
    .concat("-")
    .concat(getChainInfoForAddress(contractAddress).chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(
  contract: ContractEntity,
  tokenId: bigint
): string {
  let contractInfo = getChainInfoForAddress(contract.id);
  let chainId = contractInfo.chainId;
  let aliasKey = contractInfo.aliasKey;

  let id = aliasKey
    .concat("-")
    .concat(chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

function createStream(
  tokenId: bigint,
  event: eventLog<
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs
  >,
  watcher: WatcherEntity,
  contract: ContractEntity
): StreamEntity {
  let id = generateStreamId(event.srcAddress.toString(), tokenId);

  let alias = generateStreamAlias(contract, tokenId);
  let chainInfo = getChainInfoForAddress(event.srcAddress.toString());
  let versionCompatableTransferable: boolean =
    "transferable" in event.params
      ? Boolean(event.params["transferable"])
      : false; // all v2.0 will be false

  let partialStreamEntity: StreamEntity = {
    id: id,
    version: chainInfo.version,
    tokenId: tokenId,
    alias: alias,
    contract: contract.id,
    subgraphId: watcher.streamIndex,
    hash: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
    category: "",
    funder: event.params.funder.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    parties: [
      event.params.sender.toLowerCase(),
      event.params.recipient.toLowerCase(),
    ],
    cancelable: event.params.cancelable,
    proxender: "",
    chainId: BigInt(chainInfo.chainId),
    proxied: false,
    cliff: false,
    asset: event.params.asset,
    renounceAction: null,
    renounceTime: 0n,
    canceled: false,
    canceledAction: null,
    canceledTime: 0n,
    cliffTime: 0n,
    cliffAmount: 0n,
    endTime: 0n,
    startTime: event.params.range[0],
    duration: 0n,
    transferable: versionCompatableTransferable,
    depositAmount: event.params.amounts[0],
    intactAmount: event.params.amounts[0],
    withdrawnAmount: 0n,
    brokerFeeAmount: event.params.amounts[2],
    protocolFeeAmount: event.params.amounts[1],
  };

  return partialStreamEntity;
}

export function createDynamicStream(
  event: eventLog<SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity,
  asset: AssetEntity
): StreamEntity {
  let tokenId = event.params.streamId;
  let partialStreamEntity: StreamEntity = createStream(
    tokenId,
    event,
    watcher,
    contract
  );

  // /** --------------- */
  // entity = createSegments(entity, event);

  let duration = minus(event.params.range[1], event.params.range[0]);

  const streamEntity: StreamEntity = {
    ...partialStreamEntity,
    category: "LockupDynamic",
    endTime: event.params.range[1],
    duration: duration,
    asset: asset.id,
    cliff: false,
  };

  // TODO: leaving this out for now for the complexity it will add
  //   let resolved = bindProxyOwner(entity);

  return streamEntity;
}
export function createLinearStream(
  event: eventLog<SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity,
  asset: AssetEntity
): StreamEntity {
  let tokenId = event.params.streamId;
  let partialStreamEntity: StreamEntity = createStream(
    tokenId,
    event,
    watcher,
    contract
  );

  let deposit = event.params.amounts[0];
  let duration = event.params.range[2] - event.params.range[0];
  let cliffDuration = event.params.range[1] - event.params.range[0];

  let cliff = false;
  let cliffAmount = 0n;
  let cliffTime = 0n;

  if (cliffDuration != 0n) {
    cliff = true;
    cliffAmount = div(mul(deposit, cliffDuration), duration);
    cliffTime = event.params.range[1];
  } else {
    cliff = false;
    cliffAmount = 0n;
    cliffTime = 0n;
  }
  const streamEntity: StreamEntity = {
    ...partialStreamEntity,
    category: "LockupLinear",
    endTime: event.params.range[2],
    duration: duration,
    asset: asset.id,
    cliff: cliff,
    cliffAmount: cliffAmount,
    cliffTime: cliffTime,
  };

  // TODO: leaving this out for now for the complexity it will add
  //   let resolved = bindProxyOwner(entity);

  return streamEntity;
}

export function updateStreamCancelInfo(
  event: eventLog<any>,
  stream: StreamEntity,
  action: ActionEntity
): StreamEntity {
  return {
    ...stream,
    canceled: true,
    canceledAction: action.id,
    canceledTime: BigInt(event.blockTimestamp),
    intactAmount: event.params.recipientAmount, // The only amount remaining in the stream is the non-withdrawn recipient amount
  };
}

export function updateStreamRenounceInfo(
  event: eventLog<any>,
  stream: StreamEntity,
  action: ActionEntity
): StreamEntity {
  return {
    ...stream,
    cancelable: false,
    renounceAction: action.id,
    renounceTime: BigInt(event.blockTimestamp),
  };
}

export function updateStreamRenounceInfoAtCreation(
  event: eventLog<any>,
  stream: StreamEntity,
  action: ActionEntity
): StreamEntity {
  if (stream.cancelable == false) {
    return {
      ...stream,
      renounceAction: action.id,
      renounceTime: BigInt(event.blockTimestamp),
    };
  } else {
    return stream;
  }
}

export function updateStreamTransferInfo(
  event: eventLog<SablierV2LockupContract_TransferEvent_eventArgs>,
  stream: StreamEntity
): StreamEntity {
  let recipient = event.params.to;
  let parties = [stream.sender, event.params.to];

  if (stream.proxied) {
    // Without explicit copies, AssemblyScript will crash (i.e. don't use stream.proxender directly) */
    let proxender = stream.proxender;
    if (stream.proxender !== null) {
      parties.push(stream.proxender);
    }
  }
  return {
    ...stream,
    recipient: recipient,
    parties: parties,
  };
}

export function updateStreamWithdrawalInfo(
  event: eventLog<SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs>,
  stream: StreamEntity
): StreamEntity {
  let amount = event.params.amount;
  let withdrawn = add(stream.withdrawnAmount, amount);

  if (stream.canceledAction) {
    return {
      ...stream,
      withdrawnAmount: withdrawn,
      // The intact amount (recipient) has been set in the cancel action, now subtract
      intactAmount: minus(stream.intactAmount, amount),
    };
  } else {
    return {
      ...stream,
      withdrawnAmount: withdrawn,
      intactAmount: minus(stream.intactAmount, withdrawn),
    };
  }
}
