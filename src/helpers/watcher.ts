import { WatcherEntity } from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

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
  watcher: WatcherEntity
): WatcherEntity {
  return {
    ...watcher,
    streamIndex: watcher.streamIndex + 1n,
  };
}
