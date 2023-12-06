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
    SablierV2LockupLinear_ApprovalEntity,
    SablierV2LockupLinear_ApprovalForAllEntity,
    SablierV2LockupLinear_CancelLockupStreamEntity,
    SablierV2LockupLinear_CreateLockupLinearStreamEntity,
    SablierV2LockupLinear_RenounceLockupStreamEntity,
    SablierV2LockupLinear_TransferEntity,
    SablierV2LockupLinear_TransferAdminEntity,
    SablierV2LockupLinear_WithdrawFromLockupStreamEntity,
EventsSummaryEntity
} from "./src/Types.gen";

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
    sablierV2LockupLinear_ApprovalCount: currentSummaryEntity.sablierV2LockupLinear_ApprovalCount + BigInt(1),
  };

  const sablierV2LockupLinear_ApprovalEntity: SablierV2LockupLinear_ApprovalEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      owner: event.params.owner      ,
      approved: event.params.approved      ,
      tokenId: event.params.tokenId      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_Approval.set(sablierV2LockupLinear_ApprovalEntity);
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
    sablierV2LockupLinear_ApprovalForAllCount: currentSummaryEntity.sablierV2LockupLinear_ApprovalForAllCount + BigInt(1),
  };

  const sablierV2LockupLinear_ApprovalForAllEntity: SablierV2LockupLinear_ApprovalForAllEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      owner: event.params.owner      ,
      operator: event.params.operator      ,
      approved: event.params.approved      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_ApprovalForAll.set(sablierV2LockupLinear_ApprovalForAllEntity);
});
    SablierV2LockupLinearContract_CancelLockupStream_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    SablierV2LockupLinearContract_CancelLockupStream_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_CancelLockupStreamCount: currentSummaryEntity.sablierV2LockupLinear_CancelLockupStreamCount + BigInt(1),
  };

  const sablierV2LockupLinear_CancelLockupStreamEntity: SablierV2LockupLinear_CancelLockupStreamEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      streamId: event.params.streamId      ,
      sender: event.params.sender      ,
      recipient: event.params.recipient      ,
      senderAmount: event.params.senderAmount      ,
      recipientAmount: event.params.recipientAmount      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_CancelLockupStream.set(sablierV2LockupLinear_CancelLockupStreamEntity);
});
    SablierV2LockupLinearContract_CreateLockupLinearStream_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    SablierV2LockupLinearContract_CreateLockupLinearStream_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_CreateLockupLinearStreamCount: currentSummaryEntity.sablierV2LockupLinear_CreateLockupLinearStreamCount + BigInt(1),
  };

  const sablierV2LockupLinear_CreateLockupLinearStreamEntity: SablierV2LockupLinear_CreateLockupLinearStreamEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      streamId: event.params.streamId      ,
      funder: event.params.funder      ,
      sender: event.params.sender      ,
      recipient: event.params.recipient      ,
      amounts_0: event.params.amounts
          [0]
      ,
      amounts_1: event.params.amounts
          [1]
      ,
      amounts_2: event.params.amounts
          [2]
      ,
      asset: event.params.asset      ,
      cancelable: event.params.cancelable      ,
      range_0: event.params.range
          [0]
      ,
      range_1: event.params.range
          [1]
      ,
      range_2: event.params.range
          [2]
      ,
      broker: event.params.broker      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_CreateLockupLinearStream.set(sablierV2LockupLinear_CreateLockupLinearStreamEntity);
});
    SablierV2LockupLinearContract_RenounceLockupStream_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    SablierV2LockupLinearContract_RenounceLockupStream_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_RenounceLockupStreamCount: currentSummaryEntity.sablierV2LockupLinear_RenounceLockupStreamCount + BigInt(1),
  };

  const sablierV2LockupLinear_RenounceLockupStreamEntity: SablierV2LockupLinear_RenounceLockupStreamEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      streamId: event.params.streamId      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_RenounceLockupStream.set(sablierV2LockupLinear_RenounceLockupStreamEntity);
});
    SablierV2LockupLinearContract_Transfer_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    SablierV2LockupLinearContract_Transfer_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_TransferCount: currentSummaryEntity.sablierV2LockupLinear_TransferCount + BigInt(1),
  };

  const sablierV2LockupLinear_TransferEntity: SablierV2LockupLinear_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      from: event.params.from      ,
      to: event.params.to      ,
      tokenId: event.params.tokenId      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_Transfer.set(sablierV2LockupLinear_TransferEntity);
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
    sablierV2LockupLinear_TransferAdminCount: currentSummaryEntity.sablierV2LockupLinear_TransferAdminCount + BigInt(1),
  };

  const sablierV2LockupLinear_TransferAdminEntity: SablierV2LockupLinear_TransferAdminEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      oldAdmin: event.params.oldAdmin      ,
      newAdmin: event.params.newAdmin      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_TransferAdmin.set(sablierV2LockupLinear_TransferAdminEntity);
});
    SablierV2LockupLinearContract_WithdrawFromLockupStream_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    SablierV2LockupLinearContract_WithdrawFromLockupStream_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    sablierV2LockupLinear_WithdrawFromLockupStreamCount: currentSummaryEntity.sablierV2LockupLinear_WithdrawFromLockupStreamCount + BigInt(1),
  };

  const sablierV2LockupLinear_WithdrawFromLockupStreamEntity: SablierV2LockupLinear_WithdrawFromLockupStreamEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      streamId: event.params.streamId      ,
      to: event.params.to      ,
      amount: event.params.amount      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SablierV2LockupLinear_WithdrawFromLockupStream.set(sablierV2LockupLinear_WithdrawFromLockupStreamEntity);
});
