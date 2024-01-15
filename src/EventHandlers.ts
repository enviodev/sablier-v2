/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  // v20
  SablierV2LockupContract_Approval_loader,
  SablierV2LockupContract_Approval_handler,
  SablierV2LockupContract_ApprovalForAll_loader,
  SablierV2LockupContract_ApprovalForAll_handler,
  SablierV2LockupContract_CancelLockupStream_loader,
  SablierV2LockupContract_CancelLockupStream_handler,
  SablierV2LockupContract_CreateLockupLinearStream_loader,
  SablierV2LockupContract_CreateLockupLinearStream_handlerAsync,
  SablierV2LockupContract_CreateLockupDynamicStream_loader,
  SablierV2LockupContract_CreateLockupDynamicStream_handlerAsync,
  SablierV2LockupContract_RenounceLockupStream_loader,
  SablierV2LockupContract_RenounceLockupStream_handler,
  SablierV2LockupContract_Transfer_loader,
  SablierV2LockupContract_Transfer_handler,
  SablierV2LockupContract_TransferAdmin_loader,
  SablierV2LockupContract_TransferAdmin_handler,
  SablierV2LockupContract_WithdrawFromLockupStream_loader,
  SablierV2LockupContract_WithdrawFromLockupStream_handler,
  // v21
  SablierV21LockupContract_Approval_loader,
  SablierV21LockupContract_Approval_handler,
  SablierV21LockupContract_ApprovalForAll_loader,
  SablierV21LockupContract_ApprovalForAll_handler,
  SablierV21LockupContract_CancelLockupStream_loader,
  SablierV21LockupContract_CancelLockupStream_handler,
  SablierV21LockupContract_CreateLockupLinearStream_loader,
  SablierV21LockupContract_CreateLockupLinearStream_handlerAsync,
  SablierV21LockupContract_CreateLockupDynamicStream_loader,
  SablierV21LockupContract_CreateLockupDynamicStream_handlerAsync,
  SablierV21LockupContract_RenounceLockupStream_loader,
  SablierV21LockupContract_RenounceLockupStream_handler,
  SablierV21LockupContract_Transfer_loader,
  SablierV21LockupContract_Transfer_handler,
  SablierV21LockupContract_TransferAdmin_loader,
  SablierV21LockupContract_TransferAdmin_handler,
  SablierV21LockupContract_WithdrawFromLockupStream_loader,
  SablierV21LockupContract_WithdrawFromLockupStream_handler,
} from "../generated/src/Handlers.gen";

import {
  AssetEntity,
  ContractEntity,
  StreamEntity,
  WatcherEntity,
} from "./src/Types.gen";

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
import { createAsset } from "./helpers/asset";
import { createContract, upgradeContractAdminInfo } from "./helpers/contract";
import {
  createDynamicStream,
  createLinearStream,
  generateStreamId,
  updateStreamCancelInfo,
  updateStreamRenounceInfo,
  updateStreamRenounceInfoAtCreation,
  updateStreamTransferInfo,
  updateStreamWithdrawalInfo,
} from "./helpers/streams";
import {
  createWatcher,
  updateWatcherActionIndex,
  updateWatcherStreamIndex,
} from "./helpers/watcher";

import sendMessageToQueue from "./rabbitmq/send";

import { getChainInfoForAddress } from "../src/helpers/index";

import {
  eventLog,
  SablierV2LockupContract_ApprovalEvent_eventArgs,
  SablierV21LockupContract_ApprovalEvent_eventArgs,
  SablierV2LockupContract_ApprovalEvent_loaderContext,
  SablierV21LockupContract_ApprovalEvent_loaderContext,
  SablierV2LockupContract_ApprovalEvent_handlerContext,
  SablierV21LockupContract_ApprovalEvent_handlerContext,
  //
  SablierV2LockupContract_ApprovalForAllEvent_eventArgs,
  SablierV21LockupContract_ApprovalForAllEvent_eventArgs,
  SablierV2LockupContract_ApprovalForAllEvent_loaderContext,
  SablierV21LockupContract_ApprovalForAllEvent_loaderContext,
  SablierV2LockupContract_ApprovalForAllEvent_handlerContext,
  SablierV21LockupContract_ApprovalForAllEvent_handlerContext,
  //
  SablierV2LockupContract_CancelLockupStreamEvent_eventArgs,
  SablierV21LockupContract_CancelLockupStreamEvent_eventArgs,
  SablierV2LockupContract_CancelLockupStreamEvent_loaderContext,
  SablierV21LockupContract_CancelLockupStreamEvent_loaderContext,
  SablierV2LockupContract_CancelLockupStreamEvent_handlerContext,
  SablierV21LockupContract_CancelLockupStreamEvent_handlerContext,
  //
  SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs,
  SablierV21LockupContract_CreateLockupLinearStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupLinearStreamEvent_loaderContext,
  SablierV21LockupContract_CreateLockupLinearStreamEvent_loaderContext,
  SablierV2LockupContract_CreateLockupLinearStreamEvent_handlerContextAsync,
  SablierV21LockupContract_CreateLockupLinearStreamEvent_handlerContextAsync,
  //
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV21LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_loaderContext,
  SablierV21LockupContract_CreateLockupDynamicStreamEvent_loaderContext,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_handlerContextAsync,
  SablierV21LockupContract_CreateLockupDynamicStreamEvent_handlerContextAsync,
  //
  SablierV2LockupContract_RenounceLockupStreamEvent_eventArgs,
  SablierV21LockupContract_RenounceLockupStreamEvent_eventArgs,
  SablierV2LockupContract_RenounceLockupStreamEvent_loaderContext,
  SablierV21LockupContract_RenounceLockupStreamEvent_loaderContext,
  SablierV2LockupContract_RenounceLockupStreamEvent_handlerContext,
  SablierV21LockupContract_RenounceLockupStreamEvent_handlerContext,
  //
  SablierV2LockupContract_TransferEvent_eventArgs,
  SablierV21LockupContract_TransferEvent_eventArgs,
  SablierV2LockupContract_TransferEvent_loaderContext,
  SablierV21LockupContract_TransferEvent_loaderContext,
  SablierV2LockupContract_TransferEvent_handlerContext,
  SablierV21LockupContract_TransferEvent_handlerContext,
  //
  SablierV2LockupContract_TransferAdminEvent_eventArgs,
  SablierV21LockupContract_TransferAdminEvent_eventArgs,
  SablierV2LockupContract_TransferAdminEvent_loaderContext,
  SablierV21LockupContract_TransferAdminEvent_loaderContext,
  SablierV2LockupContract_TransferAdminEvent_handlerContext,
  SablierV21LockupContract_TransferAdminEvent_handlerContext,
  //
  SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs,
  SablierV21LockupContract_WithdrawFromLockupStreamEvent_eventArgs,
  SablierV2LockupContract_WithdrawFromLockupStreamEvent_loaderContext,
  SablierV21LockupContract_WithdrawFromLockupStreamEvent_loaderContext,
  SablierV2LockupContract_WithdrawFromLockupStreamEvent_handlerContext,
  SablierV21LockupContract_WithdrawFromLockupStreamEvent_handlerContext,
} from "../generated/src/Types.gen";

export const indexerStartTimestamp = Math.floor(new Date().getTime() / 1000);

type approval_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_ApprovalEvent_eventArgs
    | SablierV21LockupContract_ApprovalEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_ApprovalEvent_loaderContext
    | SablierV21LockupContract_ApprovalEvent_loaderContext;
};

const approval_loader = (input: approval_loader_input) => {
  let { event, context } = input;
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
};

SablierV2LockupContract_Approval_loader(({ event, context }) => {
  approval_loader({ event, context });
});

SablierV21LockupContract_Approval_loader(({ event, context }) => {
  approval_loader({ event, context });
});

type approval_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_ApprovalEvent_eventArgs
    | SablierV21LockupContract_ApprovalEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_ApprovalEvent_handlerContext
    | SablierV21LockupContract_ApprovalEvent_handlerContext;
};

const approval_handler = (input: approval_handler_input) => {
  let { event, context } = input;
  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

  let actionEntity = createApprovalAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  let stream = context.Stream.get(streamId);

  if (!stream) {
    context.log.info(
      `[SABLIER] Stream hasn't been registered before this Approval event: ${streamId}`
    );
    context.log.error(
      "[SABLIER] - non existent stream, shouldn't be able to Approve on a non existent stream"
    );
  } else {
    context.Action.set(updateActionStreamInfo(streamId, actionEntity));
  }

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
};

SablierV2LockupContract_Approval_handler(({ event, context }) => {
  approval_handler({ event, context });
});
SablierV21LockupContract_Approval_handler(({ event, context }) => {
  approval_handler({ event, context });
});

type approvalForAll_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_ApprovalForAllEvent_eventArgs
    | SablierV21LockupContract_ApprovalForAllEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_ApprovalForAllEvent_loaderContext
    | SablierV21LockupContract_ApprovalForAllEvent_loaderContext;
};

const approvalForAll_loader = (input: approvalForAll_loader_input) => {
  let { event, context } = input;
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
};

SablierV2LockupContract_ApprovalForAll_loader(({ event, context }) => {
  approvalForAll_loader({ event, context });
});

SablierV21LockupContract_ApprovalForAll_loader(({ event, context }) => {
  approvalForAll_loader({ event, context });
});

type approvalForAll_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_ApprovalForAllEvent_eventArgs
    | SablierV21LockupContract_ApprovalForAllEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_ApprovalForAllEvent_handlerContext
    | SablierV21LockupContract_ApprovalForAllEvent_handlerContext;
};

const approvalForAll_handler = (input: approvalForAll_handler_input) => {
  let { event, context } = input;
  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

  let actionEntity = createApprovalForAllAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  context.Action.set(actionEntity);

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
};

SablierV2LockupContract_ApprovalForAll_handler(({ event, context }) => {
  approvalForAll_handler({ event, context });
});
SablierV21LockupContract_ApprovalForAll_handler(({ event, context }) => {
  approvalForAll_handler({ event, context });
});

type cancelLockupStream_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_CancelLockupStreamEvent_eventArgs
    | SablierV21LockupContract_CancelLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CancelLockupStreamEvent_loaderContext
    | SablierV21LockupContract_CancelLockupStreamEvent_loaderContext;
};

const cancelLockupStream_loader = (input: cancelLockupStream_loader_input) => {
  let { event, context } = input;
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
  let streamTokenId = event.params.streamId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
};

SablierV2LockupContract_CancelLockupStream_loader(({ event, context }) => {
  cancelLockupStream_loader({ event, context });
});
SablierV21LockupContract_CancelLockupStream_loader(({ event, context }) => {
  cancelLockupStream_loader({ event, context });
});

type cancelLockupStream_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_CancelLockupStreamEvent_eventArgs
    | SablierV21LockupContract_CancelLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CancelLockupStreamEvent_handlerContext
    | SablierV21LockupContract_CancelLockupStreamEvent_handlerContext;
};

const cancelLockupStream_handler = (
  input: cancelLockupStream_handler_input
) => {
  let { event, context } = input;
  // proxy for if the indexer is live indexing

  if (event.blockTimestamp > indexerStartTimestamp) {
    context.log.info("Sending message to queue");
    sendMessageToQueue(
      `Stream was cancelled \n tx: ${event.transactionHash} \n sender: ${
        event.params.sender
      } \n recipient ${event.params.recipient} \n senderAmount: ${
        event.params.senderAmount
      } \n recipientAmount: ${event.params.recipientAmount} \n streamId: ${
        event.params.streamId
      } \n chainId: ${getChainInfoForAddress(event.srcAddress).chainId} `
    );
  }

  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ??
    createWatcher(getChainInfoForAddress(event.srcAddress).chainId.toString());

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
};

SablierV2LockupContract_CancelLockupStream_handler(({ event, context }) => {
  cancelLockupStream_handler({ event, context });
});
SablierV21LockupContract_CancelLockupStream_handler(({ event, context }) => {
  cancelLockupStream_handler({ event, context });
});

type createLockupDynamicStream_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_loaderContext
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_loaderContext;
};

const createLockupDynamicStream_loader = (
  input: createLockupDynamicStream_loader_input
) => {
  let { event, context } = input;
  context.Asset.load(event.params.asset.toString());
  context.Contract.load(event.srcAddress.toString());
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
  let streamTokenId = event.params.streamId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
};

SablierV2LockupContract_CreateLockupDynamicStream_loader(
  ({ event, context }) => {
    createLockupDynamicStream_loader({ event, context });
  }
);
SablierV21LockupContract_CreateLockupDynamicStream_loader(
  ({ event, context }) => {
    createLockupDynamicStream_loader({ event, context });
  }
);

type createLockupDynamicStream_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_handlerContextAsync
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_handlerContextAsync;
};

const createLockupDynamicStream_handler = async (
  input: createLockupDynamicStream_handler_input
) => {
  let { event, context } = input;
  const asset = await context.Asset.get(event.params.asset.toString());
  const contract = await context.Contract.get(event.srcAddress.toString());
  const watcher = await context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

  const assetEntity: AssetEntity =
    asset ??
    (await createAsset(event.params.asset.toString(), watcherEntity.chainId));

  const contractEntity: ContractEntity =
    contract ?? createContract(event.srcAddress.toString());

  // Create the stream entity
  let newStreamEntity: StreamEntity = createDynamicStream(
    event,
    watcherEntity,
    contractEntity,
    assetEntity,
    context
  );

  // Create the action entity
  let newActionEntity = createCreateAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  // Updating entity values
  await context.Action.set(
    updateActionStreamInfo(newStreamEntity.id, newActionEntity)
  );
  await context.Asset.set(assetEntity);
  await context.Stream.set(
    updateStreamRenounceInfoAtCreation(event, newStreamEntity, newActionEntity)
  );
  await context.Contract.set(contractEntity);
  await context.Watcher.set(
    updateWatcherActionIndex(
      updateWatcherStreamIndex(watcherEntity, { event, context })
    )
  );
};

SablierV2LockupContract_CreateLockupDynamicStream_handlerAsync(
  async ({ event, context }) => {
    await createLockupDynamicStream_handler({ event, context });
  }
);
SablierV21LockupContract_CreateLockupDynamicStream_handlerAsync(
  async ({ event, context }) => {
    await createLockupDynamicStream_handler({ event, context });
  }
);

type createLockupLinearStream_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs
    | SablierV21LockupContract_CreateLockupLinearStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_loaderContext
    | SablierV21LockupContract_CreateLockupLinearStreamEvent_loaderContext;
};

const createLockupLinearStream_loader = (
  input: createLockupLinearStream_loader_input
) => {
  let { event, context } = input;
  context.Asset.load(event.params.asset.toString());
  context.Contract.load(event.srcAddress.toString());
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
};

SablierV2LockupContract_CreateLockupLinearStream_loader(
  ({ event, context }) => {
    createLockupLinearStream_loader({ event, context });
  }
);
SablierV21LockupContract_CreateLockupLinearStream_loader(
  ({ event, context }) => {
    createLockupLinearStream_loader({ event, context });
  }
);

type createLockupLinearStream_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_eventArgs
    | SablierV21LockupContract_CreateLockupLinearStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_CreateLockupLinearStreamEvent_handlerContextAsync
    | SablierV21LockupContract_CreateLockupLinearStreamEvent_handlerContextAsync;
};

const createLockupLinearStream_handler = async (
  input: createLockupLinearStream_handler_input
) => {
  let { event, context } = input;
  const asset = await context.Asset.get(event.params.asset.toString());
  const contract = await context.Contract.get(event.srcAddress.toString());
  const watcher = await context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

  const assetEntity: AssetEntity =
    asset ??
    (await createAsset(event.params.asset.toString(), watcherEntity.chainId));

  const contractEntity: ContractEntity =
    contract ?? createContract(event.srcAddress.toString());

  // Create the stream entity
  let newStreamEntity: StreamEntity = createLinearStream(
    event,
    watcherEntity,
    contractEntity,
    assetEntity
  );

  // Create the action entity
  let newActionEntity = createCreateAction(
    event,
    watcherEntity,
    event.srcAddress.toString()
  );

  // Updating entity values
  await context.Action.set(
    updateActionStreamInfo(newStreamEntity.id, newActionEntity)
  );
  await context.Asset.set(assetEntity);
  await context.Stream.set(
    updateStreamRenounceInfoAtCreation(event, newStreamEntity, newActionEntity)
  );
  await context.Contract.set(contractEntity);
  await context.Watcher.set(
    updateWatcherActionIndex(
      updateWatcherStreamIndex(watcherEntity, { event, context })
    )
  );
};

SablierV2LockupContract_CreateLockupLinearStream_handlerAsync(
  async ({ event, context }) => {
    await createLockupLinearStream_handler({ event, context });
  }
);
SablierV21LockupContract_CreateLockupLinearStream_handlerAsync(
  async ({ event, context }) => {
    await createLockupLinearStream_handler({ event, context });
  }
);

type renounceLockupStream_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_RenounceLockupStreamEvent_eventArgs
    | SablierV21LockupContract_RenounceLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_RenounceLockupStreamEvent_loaderContext
    | SablierV21LockupContract_RenounceLockupStreamEvent_loaderContext;
};

const renounceLockupStream_loader = (
  input: renounceLockupStream_loader_input
) => {
  let { event, context } = input;
  let streamTokenId = event.params.streamId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
};

SablierV2LockupContract_RenounceLockupStream_loader(({ event, context }) => {
  renounceLockupStream_loader({ event, context });
});
SablierV21LockupContract_RenounceLockupStream_loader(({ event, context }) => {
  renounceLockupStream_loader({ event, context });
});

type renounceLockupStream_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_RenounceLockupStreamEvent_eventArgs
    | SablierV21LockupContract_RenounceLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_RenounceLockupStreamEvent_handlerContext
    | SablierV21LockupContract_RenounceLockupStreamEvent_handlerContext;
};

const renounceLockupStream_handler = (
  input: renounceLockupStream_handler_input
) => {
  let { event, context } = input;
  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

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
};

SablierV2LockupContract_RenounceLockupStream_handler(({ event, context }) => {
  renounceLockupStream_handler({ event, context });
});
SablierV21LockupContract_RenounceLockupStream_handler(({ event, context }) => {
  renounceLockupStream_handler({ event, context });
});

type transfer_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_TransferEvent_eventArgs
    | SablierV21LockupContract_TransferEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_TransferEvent_loaderContext
    | SablierV21LockupContract_TransferEvent_loaderContext;
};

const transfer_loader = (input: transfer_loader_input) => {
  let { event, context } = input;
  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
};

SablierV2LockupContract_Transfer_loader(({ event, context }) => {
  transfer_loader({ event, context });
});
SablierV21LockupContract_Transfer_loader(({ event, context }) => {
  transfer_loader({ event, context });
});

type transfer_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_TransferEvent_eventArgs
    | SablierV21LockupContract_TransferEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_TransferEvent_handlerContext
    | SablierV21LockupContract_TransferEvent_handlerContext;
};

const transfer_handler = (input: transfer_handler_input) => {
  let { event, context } = input;
  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

  let streamTokenId = event.params.tokenId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  let stream = context.Stream.get(streamId);

  if (
    stream == undefined &&
    event.params.from != "0x0000000000000000000000000000000000000000"
  ) {
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
    if (stream != undefined) {
      context.Stream.set(updateStreamTransferInfo(event, stream));
    }
  }

  context.Watcher.set(updateWatcherActionIndex(watcherEntity));
};

SablierV2LockupContract_Transfer_handler(({ event, context }) => {
  transfer_handler({ event, context });
});
SablierV21LockupContract_Transfer_handler(({ event, context }) => {
  transfer_handler({ event, context });
});

type transferAdmin_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_TransferAdminEvent_eventArgs
    | SablierV21LockupContract_TransferAdminEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_TransferAdminEvent_loaderContext
    | SablierV21LockupContract_TransferAdminEvent_loaderContext;
};

const transferAdmin_loader = (input: transferAdmin_loader_input) => {
  let { event, context } = input;
  context.Contract.load(event.srcAddress.toString());
};

SablierV2LockupContract_TransferAdmin_loader(({ event, context }) => {
  transferAdmin_loader({ event, context });
});

SablierV21LockupContract_TransferAdmin_loader(({ event, context }) => {
  transferAdmin_loader({ event, context });
});

type transferAdmin_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_TransferAdminEvent_eventArgs
    | SablierV21LockupContract_TransferAdminEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_TransferAdminEvent_handlerContext
    | SablierV21LockupContract_TransferAdminEvent_handlerContext;
};

const transferAdmin_handler = (input: transferAdmin_handler_input) => {
  let { event, context } = input;
  let contract = context.Contract.get(event.srcAddress.toString());

  const contractEntity: ContractEntity =
    contract ?? createContract(event.srcAddress.toString());

  context.Contract.set(upgradeContractAdminInfo(event, contractEntity));
};

SablierV2LockupContract_TransferAdmin_handler(({ event, context }) => {
  transferAdmin_handler({ event, context });
});
SablierV21LockupContract_TransferAdmin_handler(({ event, context }) => {
  transferAdmin_handler({ event, context });
});

type withdrawFromLockupStream_loader_input = {
  event: eventLog<
    | SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs
    | SablierV21LockupContract_WithdrawFromLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_WithdrawFromLockupStreamEvent_loaderContext
    | SablierV21LockupContract_WithdrawFromLockupStreamEvent_loaderContext;
};

const withdrawFromLockupStream_loader = (
  input: withdrawFromLockupStream_loader_input
) => {
  let { event, context } = input;
  context.Watcher.load(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );
  let streamTokenId = event.params.streamId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  context.Stream.load(streamId, {});
};

SablierV2LockupContract_WithdrawFromLockupStream_loader(
  ({ event, context }) => {
    withdrawFromLockupStream_loader({ event, context });
  }
);
SablierV21LockupContract_WithdrawFromLockupStream_loader(
  ({ event, context }) => {
    withdrawFromLockupStream_loader({ event, context });
  }
);

type withdrawFromLockupStream_handler_input = {
  event: eventLog<
    | SablierV2LockupContract_WithdrawFromLockupStreamEvent_eventArgs
    | SablierV21LockupContract_WithdrawFromLockupStreamEvent_eventArgs
  >;
  context:
    | SablierV2LockupContract_WithdrawFromLockupStreamEvent_handlerContext
    | SablierV21LockupContract_WithdrawFromLockupStreamEvent_handlerContext;
};

const withdrawFromLockupStream_handler = (
  input: withdrawFromLockupStream_handler_input
) => {
  let { event, context } = input;
  const watcher = context.Watcher.get(
    getChainInfoForAddress(event.srcAddress).chainId.toString()
  );

  let streamTokenId = event.params.streamId;
  let streamId = generateStreamId(event.srcAddress, streamTokenId);
  const stream = context.Stream.get(streamId);

  const watcherEntity: WatcherEntity =
    watcher ?? createWatcher(event.srcAddress.toString());

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
};

SablierV2LockupContract_WithdrawFromLockupStream_handler(
  ({ event, context }) => {
    withdrawFromLockupStream_handler({ event, context });
  }
);
SablierV21LockupContract_WithdrawFromLockupStream_handler(
  ({ event, context }) => {
    withdrawFromLockupStream_handler({ event, context });
  }
);
