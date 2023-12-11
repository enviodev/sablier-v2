import { expect } from "chai";
import { MockDb, SablierV2Lockup } from "../generated/src/TestHelpers.gen";
import {
  ActionEntity,
  AssetEntity,
  StreamEntity,
  WatcherEntity,
} from "../generated/src/Types.gen";
import {
  Addresses,
  Addresses_defaultAddress,
} from "../generated/src/bindings/Ethers.gen";

import { generateActionId } from "../src/helpers/action";
import { generateStreamId } from "../src/helpers/streams";
import { getChainInfoForAddress } from "../src/helpers/index";

const defaultWatcherEntity: WatcherEntity = {
  id: "0",
  chainId: 1n,
  streamIndex: 1n,
  actionIndex: 1n,
  initialized: false,
  logs: [],
};

const defaultStreamEntity: StreamEntity = {
  id: "0xb10daee1fcf62243ae27776d7a92d39dc8740f95-1-1",
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
    let mockCreateLockupLinearApprovalEvent =
      SablierV2Lockup.Approval.createMockEvent({
        // (address indexed owner, address indexed approved, uint256 indexed tokenId)
        owner: Addresses.defaultAddress,
        approved: Addresses.defaultAddress,
        tokenId: BigInt(1),
        //Need a valid lookup address to find the correct chain id
        mockEventData: {
          srcAddress: "0xb10daee1fcf62243ae27776d7a92d39dc8740f95",
        },
      });

    let actionId = generateActionId(mockCreateLockupLinearApprovalEvent);
    let streamId = generateStreamId(
      mockCreateLockupLinearApprovalEvent.srcAddress.toString(),
      mockCreateLockupLinearApprovalEvent.params.tokenId,
    );

    // Processing the mock event on the mock database
    let updatedMockDb = SablierV2Lockup.Approval.processEvent({
      event: mockCreateLockupLinearApprovalEvent,
      mockDb: mockDbInitial,
      //Optional chainId is passed here explicitly since chain matters here
      chainId: 1,
    });

    // Expected entity that should be created
    let expectedActionEntity: ActionEntity = {
      id: actionId,
      block: BigInt(mockCreateLockupLinearApprovalEvent.blockNumber),
      category: "Approval",
      chainId: BigInt(
        getChainInfoForAddress(mockCreateLockupLinearApprovalEvent.srcAddress)
          .chainId,
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
    let mockCreateLockupLinearCreateLockupLinearStreamEvent =
      SablierV2Lockup.CreateLockupLinearStream.createMockEvent({
        asset: assetId,
      });

    // Processing the mock event on the mock database
    let updatedMockDb = SablierV2Lockup.CreateLockupLinearStream.processEvent({
      event: mockCreateLockupLinearCreateLockupLinearStreamEvent,
      mockDb: mockDbInitial,
      //Optional chainId is passed here explicitly since chain matters here
      chainId: 1,
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
    // Must use deep equal since Javascript comparator of objects will always be false, since
    // it compares by reference not by value.
    expect(expectedAssetEntity).to.deep.equal(actualAssetEntity);
  });
});
