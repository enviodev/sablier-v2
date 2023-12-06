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

import { EventsSummaryEntity } from "./src/Types.gen";

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

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
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  }
);

SablierV2LockupLinearContract_CreateLockupLinearStream_handler(
  ({ event, context }) => {
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

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
