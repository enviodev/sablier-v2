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

import {
  EventsSummaryEntity,
  StreamEntity,
  WatcherEntity,
  ContractEntity,
} from "./src/Types.gen";

import {
  createCreateAction,
  createCancelAction,
  updateActionStreamInfo,
  createWithdrawAction,
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

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";
// TODO refactor this into global constants
const GLOBAL_WATCHER_ID = "1";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  sablierV2LockupLinear_ApprovalCount: BigInt(0),
  sablierV2LockupLinear_ApprovalForAllCount: BigInt(0),
  sablierV2LockupLinear_CancelLockupStreamCount: BigInt(0),
  sablierV2LockupLinear_CreateLockupLinearStreamCount: BigInt(0),
  sablierV2LockupLinear_RenounceLockupStreamCount: BigInt(0),
  sablierV2LockupLinear_TransferCount: BigInt(0),
  sablierV2LockupLinear_TransferAdminCount: BigInt(0),
  sablierV2LockupLinear_WithdrawFromLockupStreamCount: BigInt(0),
};

SablierV2LockupLinearContract_Approval_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SablierV2LockupLinearContract_Approval_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_ApprovalCount:
      currentSummaryEntity.sablierV2LockupLinear_ApprovalCount + BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
});
SablierV2LockupLinearContract_ApprovalForAll_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SablierV2LockupLinearContract_ApprovalForAll_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_ApprovalForAllCount:
      currentSummaryEntity.sablierV2LockupLinear_ApprovalForAllCount +
      BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
});
SablierV2LockupLinearContract_CancelLockupStream_loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
    context.Watcher.load(GLOBAL_WATCHER_ID);
    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    context.Stream.load(streamId, {});
  }
);

SablierV2LockupLinearContract_CancelLockupStream_handler(
  ({ event, context }) => {
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY;

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      sablierV2LockupLinear_CancelLockupStreamCount:
        currentSummaryEntity.sablierV2LockupLinear_CancelLockupStreamCount +
        BigInt(1),
    };

    context.EventsSummary.set(nextSummaryEntity);
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
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
    context.Watcher.load(GLOBAL_WATCHER_ID);
  }
);

SablierV2LockupLinearContract_CreateLockupLinearStream_handler(
  ({ event, context }) => {
    const contract = context.Contract.get(event.srcAddress.toString());
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
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
      updateActionStreamInfo(newActionEntity, newStreamEntity.id)
    );
    context.Stream.set(
      updateStreamRenounceInfo(event, newStreamEntity, newActionEntity)
    );
    context.Contract.set(contractEntity);
    context.Watcher.set(
      updateWatcherActionIndex(updateWatcherStreamIndex(watcherEntity))
    );

    // Create the asset action

    // Save the asset

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY;

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      sablierV2LockupLinear_CreateLockupLinearStreamCount:
        currentSummaryEntity.sablierV2LockupLinear_CreateLockupLinearStreamCount +
        BigInt(1),
    };

    context.EventsSummary.set(nextSummaryEntity);
  }
);

SablierV2LockupLinearContract_RenounceLockupStream_loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  }
);

SablierV2LockupLinearContract_RenounceLockupStream_handler(
  ({ event, context }) => {
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY;

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      sablierV2LockupLinear_RenounceLockupStreamCount:
        currentSummaryEntity.sablierV2LockupLinear_RenounceLockupStreamCount +
        BigInt(1),
    };

    context.EventsSummary.set(nextSummaryEntity);
  }
);
SablierV2LockupLinearContract_Transfer_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SablierV2LockupLinearContract_Transfer_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_TransferCount:
      currentSummaryEntity.sablierV2LockupLinear_TransferCount + BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
});
SablierV2LockupLinearContract_TransferAdmin_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SablierV2LockupLinearContract_TransferAdmin_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_TransferAdminCount:
      currentSummaryEntity.sablierV2LockupLinear_TransferAdminCount + BigInt(1),
  };

  context.EventsSummary.set(nextSummaryEntity);
});

SablierV2LockupLinearContract_WithdrawFromLockupStream_loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
    context.Watcher.load(GLOBAL_WATCHER_ID);
    let streamTokenId = event.params.streamId;
    let streamId = generateStreamId(event.srcAddress, streamTokenId);
    context.Stream.load(streamId, {});
  }
);

SablierV2LockupLinearContract_WithdrawFromLockupStream_handler(
  ({ event, context }) => {
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
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
        `[SABLIER] Stream hasn't been registered before this cancel event: ${streamId}`
      );
      context.log.error(
        "[SABLIER] - non existent stream, shouldnt be able to cancel a non existent stream"
      );
    } else {
      context.Stream.set(updateStreamWithdrawalInfo(event, stream));
    }

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY;

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      sablierV2LockupLinear_WithdrawFromLockupStreamCount:
        currentSummaryEntity.sablierV2LockupLinear_WithdrawFromLockupStreamCount +
        BigInt(1),
    };

    context.EventsSummary.set(nextSummaryEntity);
    context.Action.set(updateActionStreamInfo(newActionEntity, streamId));
    context.Watcher.set(updateWatcherActionIndex(watcherEntity));
  }
);
