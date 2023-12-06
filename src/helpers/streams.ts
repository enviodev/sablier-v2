import {
  StreamEntity,
  ContractEntity,
  eventLog,
  SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs,
  WatcherEntity,
  ActionEntity,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

import { mul, div } from "./maths";

export function generateStreamId(
  contractAddress: string,
  tokenId: bigint
): string {
  let id = ""
    .concat(contractAddress)
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
  let id = contract.alias
    .concat("-")
    .concat(getChainInfoForAddress(contract.id).chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

function createStream(
  tokenId: bigint,
  event: eventLog<SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity
): StreamEntity {
  let id = generateStreamId(event.srcAddress.toString(), tokenId);

  let alias = generateStreamAlias(contract, tokenId);
  let chainInfo = getChainInfoForAddress(event.srcAddress.toString())

  /** --------------- */
  let partialStreamEntity: StreamEntity = {
    id: id,
    tokenId: tokenId,
    alias: alias,
    contract: contract.id,
    subgraphId: watcher.streamIndex,
    hash: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
    chainId: BigInt(chainInfo.chainId),
    chainName: chainInfo.chainName,
    proxied: false,
    canceled: false,
    renounceAction: null,
    canceledAction: null,
    cliffAmount: 0n,
    cliffTime: 0n,
    withdrawnAmount: 0n,
    category: "",
    funder: event.params.funder,
    sender: event.params.sender,
    recipient: event.params.recipient,
    parties: [event.params.sender, event.params.recipient],
    depositAmount: event.params.amounts[0],
    brokerFeeAmount: event.params.amounts[1],
    protocolFeeAmount: event.params.amounts[2],
    intactAmount: event.params.amounts[0],
    startTime: event.params.range[0],
    endTime: event.params.range[2],
    cancelable: event.params.cancelable,
    duration: 0n,
    asset: event.params.asset,
    cliff: false,
    proxender: "",
    renounceTime: 0n,
    canceledTime: 0n,
  };

  return partialStreamEntity;
}

export function createLinearStream(
  event: eventLog<SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs>,
  watcher: WatcherEntity,
  contract: ContractEntity
): StreamEntity {
  let tokenId = event.params.streamId;
  let partialStreamEntity: StreamEntity = createStream(
    tokenId,
    event,
    watcher,
    contract
  );

  /** --------------- */
  let deposit = event.params.amounts[0];
  let duration = event.params.range[2] - event.params.range[0];
  let cliffDuration = event.params.range[1] - event.params.range[0];

  let cliff = false;
  let cliffAmount = 0n;
  let cliffTime = 0n;

  if (cliffDuration != 0n) {
    let cliff = true;
    cliffAmount = div(mul(deposit, cliffDuration), duration);
    cliffTime = event.params.range[1];
  } else {
    let cliff = false;
    cliffAmount = 0n;
    cliffTime = 0n;
  }
  const streamEntity: StreamEntity = {
    ...partialStreamEntity,
    category: "LockupLinear",
    funder: event.params.funder,
    sender: event.params.sender,
    recipient: event.params.recipient,
    parties: [event.params.sender, event.params.recipient],
    cancelable: event.params.cancelable,
    duration: duration,
    asset: event.params.asset,
    cliff: cliff,
    cliffAmount: cliffAmount,
    cliffTime: cliffTime,
  };

  // TODO: leaving this out for now for the complexity it will add
  //   let resolved = bindProxyOwner(entity);

  return streamEntity;
}

export function updateStreamRenounceInfo(
  event: eventLog<any>,
  stream: StreamEntity,
  action: ActionEntity
): StreamEntity {
  if (stream.cancelable == false) {
    let renounceAction = action.id;
    let renounceTime = BigInt(event.blockTimestamp);
    let streamEntity: StreamEntity = {
      ...stream,
    };

    return streamEntity;
  } else {
    return stream;
  }
}
