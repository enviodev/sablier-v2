import { expect } from "chai";
import {
  MockDb,
  createMockSablierV2LockupApprovalEvent,
  createMockSablierV2LockupCreateLockupLinearStreamEvent,
  eventProcessors,
} from "../generated/src/TestHelpers.gen";
import {
  ActionEntity,
  AssetEntity,
  SablierV2LockupContract_ApprovalEvent_log,
  SablierV2LockupContract_CreateLockupLinearStreamEvent_log,
  StreamEntity,
  watcherEntity,
} from "../generated/src/Types.gen";
import {
  Addresses,
  Addresses_defaultAddress,
} from "../generated/src/bindings/Ethers.gen";

import { generateActionId } from "../src/helpers/action";
import { generateStreamId } from "../src/helpers/streams";
import { getChainInfoForAddress } from "../src/helpers/index";

const defaultWatcherEntity: watcherEntity = {
  id: "0",
  chainId: 1n,
  streamIndex: 1n,
  actionIndex: 1n,
  initialized: false,
  logs: [],
};

const defaultStreamEntity: StreamEntity = {
  id: "",
  tokenId: 0n,
  alias: "",
  contract: "",
  subgraphId: 1n,
  hash: "",
  timestamp: 0n,
  category: "",
  recipient: "",
  parties: [],
  funder: "",
  sender: "",
  proxender: "",
  chainId: 1n,
  proxied: false,
  cliff: false,
  asset: "",
  cancelable: false,
  renounceAction: null,
  renounceTime: 0n,
  canceled: false,
  canceledAction: null,
  canceledTime: 0n,
  cliffTime: 0n,
  cliffAmount: 0n,
  endTime: 0n,
  startTime: 0n,
  duration: 0n,
  depositAmount: 0n,
  intactAmount: 0n,
  withdrawnAmount: 0n,
  brokerFeeAmount: 0n,
  protocolFeeAmount: 0n,
};

describe("Sablier V2 Linear Lockup Stream Tests", () => {
  it("Approval event is created correctly", () => {
    // Initializing the mock database
    let mockDbInitial = MockDb.createMockDb();

    // Initialize the entities in the mock database required for event processing
    mockDbInitial.entities.Stream.set(defaultStreamEntity);
    mockDbInitial.entities.Watcher.set(defaultWatcherEntity);

    // Creating a mock event
    let mockCreateLockupLinearApprovalEvent: SablierV2LockupContract_ApprovalEvent_log =
      createMockSablierV2LockupApprovalEvent({
        args: {
          // (address indexed owner, address indexed approved, uint256 indexed tokenId)
          owner: Addresses.defaultAddress,
          approved: Addresses.defaultAddress,
          tokenId: BigInt(1),
        },
      });

    let actionId = generateActionId(mockCreateLockupLinearApprovalEvent);
    let streamId = generateStreamId(
      mockCreateLockupLinearApprovalEvent.srcAddress.toString(),
      mockCreateLockupLinearApprovalEvent.params.tokenId
    );

    // Processing the mock event on the mock database
    let updatedMockDb = eventProcessors.SablierV2Lockup.Approval.processEvent({
      event: mockCreateLockupLinearApprovalEvent,
      mockDb: mockDbInitial,
    });

    // Expected entity that should be created
    let expectedActionEntity: ActionEntity = {
      id: actionId,
      block: BigInt(mockCreateLockupLinearApprovalEvent.blockNumber),
      category: "Approval",
      chainId: BigInt(
        getChainInfoForAddress(mockCreateLockupLinearApprovalEvent.srcAddress)
          .chainId
      ),
      contract: mockCreateLockupLinearApprovalEvent.srcAddress.toString(),
      hash: mockCreateLockupLinearApprovalEvent.transactionHash.toString(),
      from: mockCreateLockupLinearApprovalEvent.srcAddress.toString(),
      stream: streamId,
      subgraphId: 1n,
      timestamp: BigInt(mockCreateLockupLinearApprovalEvent.blockTimestamp),
      addressA: Addresses.defaultAddress,
      addressB: Addresses.defaultAddress,
      amountA: 0n,
      amountB: 0n,
    };

    // Getting the entity from the mock database
    let actualActionEntity = updatedMockDb.entities.Action.get(actionId);

    // Asserting that the entity in the mock database is the same as the expected entity
    expect(expectedActionEntity).to.deep.equal(actualActionEntity);
  });

  it("Asset entity is created correctly", () => {
    // Initializing the mock database
    let mockDbInitial = MockDb.createMockDb();

    // Initialize the entities in the mock database required for event processing
    mockDbInitial.entities.Stream.set(defaultStreamEntity);
    mockDbInitial.entities.Watcher.set(defaultWatcherEntity);

    let assetId = Addresses_defaultAddress;

    // Creating a mock event
    let mockCreateLockupLinearCreateLockupLinearStreamEvent: SablierV2LockupContract_CreateLockupLinearStreamEvent_log =
      createMockSablierV2LockupCreateLockupLinearStreamEvent({
        args: {
          asset: assetId,
        },
      });

    // Processing the mock event on the mock database
    let updatedMockDb =
      eventProcessors.SablierV2Lockup.CreateLockupLinearStream.processEvent({
        event: mockCreateLockupLinearCreateLockupLinearStreamEvent,
        mockDb: mockDbInitial,
      });

    // Expected entity that should be created
    let expectedAssetEntity: AssetEntity = {
      id: assetId,
      address: assetId,
      chainId: 1n,
    };

    // Getting the entity from the mock database
    let actualAssetEntity = updatedMockDb.entities.Asset.get(assetId);

    // Asserting that the entity in the mock database is the same as the expected entity
    expect(expectedAssetEntity).to.equal(actualAssetEntity);
  });
});
