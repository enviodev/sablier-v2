/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  SablierV2LockupLinearContract_Approval_loader,
  SablierV2LockupLinearContract_Approval_handler,
  SablierV2LockupLinearContract_ApprovalForAll_loader,
  SablierV2LockupLinearContract_ApprovalForAll_handler,
  SablierV2LockupLinearContract_CancelLockupStream_loader,
  SablierV2LockupLinearContract_CancelLockupStream_handler,
  SablierV2LockupLinearContract_CreateLockupLinearStream_loader,
  SablierV2LockupLinearContract_CreateLockupLinearStream_handler,
  SablierV2LockupLinearContract_RenounceLockupStream_loader,
  SablierV2LockupLinearContract_RenounceLockupStream_handler,
  SablierV2LockupLinearContract_Transfer_loader,
  SablierV2LockupLinearContract_Transfer_handler,
  SablierV2LockupLinearContract_TransferAdmin_loader,
  SablierV2LockupLinearContract_TransferAdmin_handler,
  SablierV2LockupLinearContract_WithdrawFromLockupStream_loader,
  SablierV2LockupLinearContract_WithdrawFromLockupStream_handler,
} from "../generated/src/Handlers.gen";

import { ContractEntity, StreamEntity, WatcherEntity } from "./src/Types.gen";

import {
  createApprovalAction,
  createApprovalForAllAction,
  createCancelAction,
  createCreateAction,
  createRenounceAction,
  createTransferAction,
  createWithdrawAction,
  updateActionStreamInfo,
} from "./helpers/action";
import { createContract, upgradeContractAdminInfo } from "./helpers/contract";
import {
  createLinearStream,
  generateStreamId,
  updateStreamCancelInfo,
  updateStreamRenounceInfo,
  updateStreamTransferInfo,
  updateStreamWithdrawalInfo,
} from "./helpers/streams";
import {
  createWatcher,
  updateWatcherActionIndex,
  updateWatcherStreamIndex,
} from "./helpers/watcher";

// TODO refactor this into global constants
export const GLOBAL_WATCHER_ID = "1";

SablierV2LockupLinearContract_Approval_loader(({ event, context }) => {
  context.Watcher.load(GLOBAL_WATCHER_ID);
  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
});

SablierV2LockupLinearContract_Approval_handler(({ event, context }) => {
  const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(GLOBAL_WATCHER_ID);

  let actionEntity = createApprovalAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  let stream = context.Stream.get(streamId);

  if (stream == undefined) {
    context.log.info(
      `[SABLIER] Stream hasn't been registered before this Approval event: ${streamId}`
    );
    context.log.error(
      "[SABLIER] - non existent stream, shouldn't be able to cancel a non existent stream"
    );
  } else {
    context.Action.set(updateActionStreamInfo(streamId, actionEntity));
  }

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
});

SablierV2LockupLinearContract_ApprovalForAll_loader(({ event, context }) => {
  context.Watcher.load(GLOBAL_WATCHER_ID);
});

SablierV2LockupLinearContract_ApprovalForAll_handler(({ event, context }) => {
  const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(GLOBAL_WATCHER_ID);

  let actionEntity = createApprovalForAllAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  context.Action.set(actionEntity);

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
});

SablierV2LockupLinearContract_CancelLockupStream_loader(
  ({ event, context }) => {
    context.Watcher.load(GLOBAL_WATCHER_ID);
    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    context.Stream.load(streamId, {});
  }
);

SablierV2LockupLinearContract_CancelLockupStream_handler(
  ({ event, context }) => {
    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);

    let actionEntity = createCancelAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    let stream = context.Stream.get(streamId);

    if (stream == undefined) {
      context.log.info(
        `[SABLIER] Stream hasn't been registered before this Cancel event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldn't be able to cancel a non existent stream"
      );
    } else {
      context.Action.set(updateActionStreamInfo(streamId, actionEntity));
      context.Stream.set(updateStreamCancelInfo(event, stream, actionEntity));
    }

    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);

SablierV2LockupLinearContract_CreateLockupLinearStream_loader(
  ({ event, context }) => {
    context.Contract.load(event.srcAddress.toString());
    context.Watcher.load(GLOBAL_WATCHER_ID);
  }
);

SablierV2LockupLinearContract_CreateLockupLinearStream_handler(
  ({ event, context }) => {
    const contract = context.Contract.get(event.srcAddress.toString());
    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);

    const contractEntity: ContractEntity =
      contract ?? createContract(event.srcAddress.toString(), "LockupLinear");

    // Create the stream entity
    let newStreamEntity: StreamEntity = createLinearStream(
      event,
      watcherEntity,
      contractEntity
    );

    // Create the action entity
    let newActionEntity = createCreateAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

    // Updating entity values
    context.Action.set(
      updateActionStreamInfo(newStreamEntity.id, newActionEntity)
    );
    context.Stream.set(
      updateStreamRenounceInfo(event, newStreamEntity, newActionEntity)
    );
    context.Contract.set(contractEntity);
    context.Watcher.set(
      updateWatcherActionIndex(updateWatcherStreamIndex(watcherEntity))
    );
  }
);

SablierV2LockupLinearContract_RenounceLockupStream_loader(
  ({ event, context }) => {
    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    context.Stream.load(streamId, {});
    context.Watcher.load(GLOBAL_WATCHER_ID);
  }
);

SablierV2LockupLinearContract_RenounceLockupStream_handler(
  ({ event, context }) => {
    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);

    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    let stream = context.Stream.get(streamId);

    if (stream == undefined) {
      context.log.info(
        `[SABLIER] Stream hasn't been registered before this Renounce event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldn't be able to renounce a non existent stream"
      );
    } else {
      let actionEntity = createRenounceAction(
        event,
        watcherEntity,
        event.srcAddress.toString()
      );

      context.Action.set(updateActionStreamInfo(streamId, actionEntity));
      context.Stream.set(updateStreamRenounceInfo(event, stream, actionEntity));
    }
    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);
SablierV2LockupLinearContract_Transfer_loader(({ event, context }) => {
  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
  context.Watcher.load(GLOBAL_WATCHER_ID);
});

SablierV2LockupLinearContract_Transfer_handler(({ event, context }) => {
  const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(GLOBAL_WATCHER_ID);

  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  let stream = context.Stream.get(streamId);

  // it always goes into this if condition here because the Transfer event seems to be emitted before CreateLockupLinearStream event for the same stream
  // TODO investigate this further
  if (stream == undefined) {
    context.log.info(
      `[SABLIER] Stream hasn't been registered before this Transfer event: ${streamId}, ${event.transactionHash}`
    );
    context.log.error(
      "[SABLIER] - non existent stream, shouldn't be able to transfer a non existent stream"
    );
  } else {
    let actionEntity = createTransferAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

    context.Action.set(actionEntity);
    context.Stream.set(updateStreamTransferInfo(event, stream));
  }

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
});

SablierV2LockupLinearContract_TransferAdmin_loader(({ event, context }) => {
  context.Contract.load(event.srcAddress.toString());
});

SablierV2LockupLinearContract_TransferAdmin_handler(({ event, context }) => {
  let contract = context.Contract.get(event.srcAddress.toString());

  const contractEntity: ContractEntity =
    contract ?? createContract(event.srcAddress.toString(), "LockupLinear");

  context.Contract.set(upgradeContractAdminInfo(event, contractEntity));
});

SablierV2LockupLinearContract_WithdrawFromLockupStream_loader(
  ({ event, context }) => {
    context.Watcher.load(GLOBAL_WATCHER_ID);
    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    context.Stream.load(streamId, {});
  }
);

SablierV2LockupLinearContract_WithdrawFromLockupStream_handler(
  ({ event, context }) => {
    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    const stream = context.Stream.get(streamId);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);

    // create Actions entity
    let newActionEntity = createWithdrawAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

    if (stream == undefined) {
      context.log.info(
        `[SABLIER] Stream hasn't been registered before this Withdraw event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldn't be able to withdraw from a non existent stream"
      );
    } else {
      context.Action.set(updateActionStreamInfo(streamId, newActionEntity));
      context.Stream.set(updateStreamWithdrawalInfo(event, stream));
    }

    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);
