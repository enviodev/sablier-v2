import { WatcherEntity } from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

import { indexerStartTimestamp } from "../EventHandlers";

import sendMessageToQueue from "../rabbitmq/send";

import { mod } from "./maths";

export function createWatcher(contractAddress: string): WatcherEntity {
  let chainId = getChainInfoForAddress(contractAddress).chainId;
  const watcherEntity: WatcherEntity = {
    id: chainId.toString(),
    chainId: BigInt(chainId),
    streamIndex: 1n,
    actionIndex: 1n,
    initialized: false,
    logs: [],
  };

  return watcherEntity;
}

export function updateWatcherActionIndex(
  watcher: WatcherEntity
): WatcherEntity {
  return {
    ...watcher,
    actionIndex: watcher.actionIndex + 1n,
  };
}

export function updateWatcherStreamIndex(
  watcher: WatcherEntity,
  { event, context }: any
): WatcherEntity {
  const updatedNumberOfStreams = watcher.streamIndex + 1n;
  let chainName = getChainInfoForAddress(event.srcAddress).chainName;

  const numberOfNewStreamsUpdateFrequencey = 1n;
  if (
    event.blockTimestamp > indexerStartTimestamp &&
    mod(updatedNumberOfStreams, numberOfNewStreamsUpdateFrequencey) === 0n
  ) {
    context.log.info("Sending message to queue on number of streams");
    sendMessageToQueue(
      `Number of streams created on ${chainName}: ${(
        watcher.streamIndex + 1n
      ).toString()}`
    );
  }

  return {
    ...watcher,
    streamIndex: watcher.streamIndex + 1n,
  };
}
