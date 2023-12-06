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

import { StreamEntity, WatcherEntity, ContractEntity } from "./src/Types.gen";

import {
  createCreateAction,
  createCancelAction,
  updateActionStreamInfo,
  createRenounceAction,
  createWithdrawAction,
  createApprovalAction,
  createApprovalForAllAction,
} from "./helpers/action";
import { createContract } from "./helpers/contract";
import {
  generateStreamId,
  createLinearStream,
  updateStreamRenounceInfo,
  updateStreamWithdrawalInfo,
} from "./helpers/streams";
import {
  createWatcher,
  updateWatcherActionIndex,
  updateWatcherStreamIndex,
} from "./helpers/watcher";

// TODO refactor this into global constants
const GLOBAL_WATCHER_ID = "1";

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

  let actionPartial = createApprovalAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  let stream = context.Stream.get(streamId);

  let action = { ...actionPartial, stream: streamId.toString() };

  context.Action.set(action);

  if (stream == undefined) {
    context.log.info(
      `[SABLIER] Stream hasn't been registered before this approval event: ${streamId}`
    );
  }

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
});


SablierV2LockupLinearContract_ApprovalForAll_loader(({ event, context }) => {
  context.Watcher.load(GLOBAL_WATCHER_ID);
});

SablierV2LockupLinearContract_ApprovalForAll_handler(
  ({ event, context }) => {

    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);
  
    let action = createApprovalForAllAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

  
    context.Action.set(action);
  
    context.Watcher.set(updateWatcherActionIndex(watcherEntity));

  }
);



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

    let actionPartial = createCancelAction(
      event,
      watcherEntity,
      event.srcAddress.toString()
    );

    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    let stream = context.Stream.get(streamId);

    let action = { ...actionPartial, stream: streamId.toString() };

    context.Action.set(action);

    if (stream == undefined) {
      context.log.info(
        `[SABLIER] Stream hasn't been registered before this cancel event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldnt be able to cancel a non existent stream"
      );
    } else {
      // Update the stream
      let streamEntity: StreamEntity = {
        ...stream,
        canceled: true,
        canceledAction: action.id,
        canceledTime: BigInt(event.blockTimestamp),
        intactAmount: event.params.recipientAmount, // The only amount remaining in the stream is the non-withdrawn recipient amount
      };

      context.Stream.set(streamEntity);
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
      contract ??
      createContract(
        event.srcAddress.toString(),
        event.srcAddress.toString(),
        "LockupLinear"
      );

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
    context.Contract.load(event.srcAddress.toString());
    context.Watcher.load(GLOBAL_WATCHER_ID);
  }
);

SablierV2LockupLinearContract_RenounceLockupStream_handler(
  ({ event, context }) => {
    const contract = context.Contract.get(event.srcAddress.toString());
    const watcher = context.Watcher.get(GLOBAL_WATCHER_ID);

    const watcherEntity: WatcherEntity =
      watcher ?? createWatcher(GLOBAL_WATCHER_ID);

    const contractEntity: ContractEntity =
      contract ??
      createContract(
        event.srcAddress.toString(),
        event.srcAddress.toString(),
        "LockupLinear"
      );

    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    let stream = context.Stream.get(streamId);

    if (stream == undefined) {
      return;
    }

    let action = createRenounceAction(event, watcherEntity, contractEntity.id);

    context.Action.set(updateActionStreamInfo(stream.id, action));

    let streamEntity = {
      ...stream,
      cancelable: false,
      renounceAction: action.id,
      renounceTime: BigInt(event.blockTimestamp),
    };

    context.Stream.set(streamEntity);
    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);
SablierV2LockupLinearContract_Transfer_loader(({ event, context }) => {});

SablierV2LockupLinearContract_Transfer_handler(({ event, context }) => {});

SablierV2LockupLinearContract_TransferAdmin_loader(({ event, context }) => {
  context.Contract.load(event.srcAddress.toString());
});

SablierV2LockupLinearContract_TransferAdmin_handler(({ event, context }) => {
  let contract = context.Contract.get(event.srcAddress.toString());

  if (contract == undefined) {
    context.log.error(
      "Contract does not exist. Cannot transfer admin to contract that does not exist."
    );
    return;
  }

  let updatedContractEntity = {
    ...contract,
    admin: event.params.newAdmin,
  };

  context.Contract.set(updatedContractEntity);
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
        `[SABLIER] Stream hasn't been registered before this withdraw event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldnt be able to withdraw from a non existent stream"
      );
    } else {
      context.Stream.set(updateStreamWithdrawalInfo(event, stream));
    }

    context.Action.set(updateActionStreamInfo(streamId, newActionEntity));
    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);
