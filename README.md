# Sablier V2 indexer

This repo contains an indexer built using Envio for Sablier V2 contracts.

## Instructions

Verify that you have all the [pre-requisites](https://docs.envio.dev/docs/installation#prerequisites) installed before continuing.

### Running locally

1. Clone this repo
1. Run `envio codegen`
1. Start Docker application
1. Run `envio dev`

_Please refer to the [documentation website](https://docs.envio.dev) for a thorough guide on all Envio indexer features_

## Summary of entities

Asset

- Purpose: Represents an ERC20 asset/token.
- Relationships:
  - One-to-Many with Stream: An asset can be associated with multiple streams.

Contract

- Purpose: Represents a contract with various attributes and categories.
- Relationships:
  - One-to-Many with Stream: A contract can create multiple streams.
  - One-to-Many with Action: A contract can have multiple actions.

Action

- Purpose: Represents an action taken within a contract, like transfers or approvals.
- Relationships:
  - Many-to-One with Contract: Each action is associated with a single contract.
  - Many-to-One with Stream (optional): Actions may be linked to a stream.

Stream

- Purpose: Represents a funding stream, with attributes like funder, recipient, and related contract.
- Relationships:
  - Many-to-One with Asset: Each stream is associated with one asset.
  - Many-to-One with Contract: Each stream is created through a specific contract.
  - One-to-Many with Action: A stream can have multiple actions.
  - One-to-Many with Segment: A stream can consist of multiple segments.
  - Many-to`-One with Batch: A stream may be part of a batch.

Segment

- Purpose: Represents a segment of a stream, detailing amounts and milestones.
- Relationships:
  - Many-to-One with Stream: Each segment is part of a specific stream.

Batch

- Purpose: Represents a batch of streams created in a single transaction.
- Relationships:
  -One-to-Many with Stream: A batch consists of multiple streams.
  -Many-to-One with Batcher: Each batch is started by a batcher.

Batcher

- Purpose: Represents an entity that starts batches of streams.
- Relationships:
  - One-to-Many with Batch: A batcher can start multiple batches.

Watcher

- Purpose: A unique entity for monitoring the subgraph.
- Relationships: Does not have direct relationships with other entities.

### Resources

- [Sablier V2 deployments](https://docs.sablier.com/contracts/v2/deployments)
- [Sablier V2 API documentation](https://docs.sablier.com/api/subgraphs/overview)
- [Sablier V2 subgraph](https://github.com/sablier-labs/v2-subgraphs)
