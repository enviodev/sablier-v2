import { WatcherEntity } from "../src/Types.gen";

export function createWatcher(watcher_id: string): WatcherEntity {
  const watcherEntity: WatcherEntity = {
    id: watcher_id,
    // TODO update this to use event.srcAddress and the helper function
    chainId: 1n,
    streamIndex: 1n,
    actionIndex: 1n,
    initialized: false,
    logs: [],
  };

  return watcherEntity;
}

export function updateWatcherStreamIndex(
  watcher: WatcherEntity
): WatcherEntity {
  return {
    ...watcher,
    streamIndex: watcher.streamIndex + 1n,
  };
}

export function updateWatcherActionIndex(
  watcher: WatcherEntity
): WatcherEntity {
  return {
    ...watcher,
    actionIndex: watcher.actionIndex + 1n,
  };
}
