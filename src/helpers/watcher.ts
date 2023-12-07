import { WatcherEntity } from "../src/Types.gen";

import { getChainInfoForAddress } from "./index";

export function createWatcher(
  watcherId: string,
  contractAddress: string
): WatcherEntity {
  const watcherEntity: WatcherEntity = {
    id: watcherId,
    chainId: BigInt(getChainInfoForAddress(contractAddress).chainId),
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
