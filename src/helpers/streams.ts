import {
  StreamEntity,
  ContractEntity,
  eventLog,
  SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs,
  WatcherEntity,
  ActionEntity,
} from "../src/Types.gen";

import { getChainId } from "./index";

import { mul, div } from "./maths";

export function generateStreamId(
  contractAddress: string,
  tokenId: bigint
): string {
  let id = ""
    .concat(contractAddress)
    .concat("-")
    .concat(getChainId().toString())
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
    .concat(getChainId().toString())
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

  let partialStreamEntity: StreamEntity = {
    id: id,
    tokenId: tokenId,
    alias: alias,
    contract: contract.id,
    subgraphId: watcher.streamIndex,
    hash: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
    chainId: getChainId(),
    category: "",
    recipient: event.params.recipient,
    parties: [event.params.sender, event.params.recipient],
    funder: event.params.funder,
    sender: event.params.sender,
    proxender: "",
    proxied: false,
    cliff: false,
    asset: event.params.asset,
    cancelable: event.params.cancelable,
    renounceAction: null,
    renounceTime: 0n,
    canceled: false,
    canceledAction: null,
    canceledTime: 0n,
    cliffTime: 0n,
    cliffAmount: 0n,
    endTime: event.params.range[2],
    startTime: event.params.range[0],
    duration: event.params.range[2] - event.params.range[0],
    depositAmount: event.params.amounts[0],
    intactAmount: event.params.amounts[0],
    withdrawnAmount: 0n,
    brokerFeeAmount: event.params.amounts[1],
    protocolFeeAmount: event.params.amounts[2],
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
    return {
      ...stream,
      renounceAction: action.id,
      renounceTime: BigInt(event.blockTimestamp),
    };
  } else {
    return stream;
  }
}
