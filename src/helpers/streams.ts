import {
  StreamEntity,
  ContractEntity,
  eventLog,
  SablierV2LockupLinearContract_CreateLockupLinearStreamEvent_eventArgs,
  WatcherEntity,
  ActionEntity,
  SablierV2LockupLinearContract_WithdrawFromLockupStreamEvent_eventArgs,
  SablierV2LockupLinearContract_TransferEvent_eventArgs,
} from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

import { mul, div, add, minus } from "./maths";

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
  let chainInfo = getChainInfoForAddress(event.srcAddress.toString());

  let partialStreamEntity: StreamEntity = {
    id: id,
    tokenId: tokenId,
    alias: alias,
    contract: contract.id,
    subgraphId: watcher.streamIndex,
    hash: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
    category: "",
    recipient: event.params.recipient,
    parties: [event.params.sender, event.params.recipient],
    funder: event.params.funder,
    sender: event.params.sender,
    proxender: "",
    chainId: BigInt(chainInfo.chainId),
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

export function updateStreamTransferInfo(
  event: eventLog<SablierV2LockupLinearContract_TransferEvent_eventArgs>,
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
  event: eventLog<SablierV2LockupLinearContract_WithdrawFromLockupStreamEvent_eventArgs>,
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
