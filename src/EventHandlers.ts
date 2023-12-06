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

import { createWatcher } from "./helpers/watcher";
import { createContract } from "./helpers/contract";
import { createLinearStream } from "./helpers/streams";

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

    context.Stream.set(newStreamEntity);
    context.Contract.set(contractEntity);
    context.Watcher.set(watcherEntity);

    // Create the action entity

    // Create the asset action

    // Save stream

    // Save action

    // Save the asset

    // Update Watcher
    /** --------------- */

    // watcher.streamIndex = watcher.streamIndex.plus(1);
    // watcher.save();
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
  }
);

SablierV2LockupLinearContract_WithdrawFromLockupStream_handler(
  ({ event, context }) => {
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY;

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      sablierV2LockupLinear_WithdrawFromLockupStreamCount:
        currentSummaryEntity.sablierV2LockupLinear_WithdrawFromLockupStreamCount +
        BigInt(1),
    };

    context.EventsSummary.set(nextSummaryEntity);
  }
);
