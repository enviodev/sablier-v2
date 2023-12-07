---
sidebar_position: 1
---

# Entities

GraphQL entities defined by the Envio Indexer are meant to mirror the functionality exposed by the v2-core contracts.

The schema.graphql file is responsible for defining the entities and their relationships, and is used to define how the data is served. The data can be queried using the graphQL API.

Below is a table of entities and their relationships types defined in the graphql schema that represents that data structure of Sablier V2 smart contracts.

### Primary

| Entity   | Description                                                                                |
| -------- | ------------------------------------------------------------------------------------------ |
| Contract | Instances of `SablierV2LockupLinear` or `SablierV2LockupDynamic`                           |
| Action   | Emitted events transformed into historical entries (e.g. Create, Withdraw)                 |
| Stream   | Primary entity tracking the up to date state of a stream                                   |
| Asset    | The ERC20 asset that is being streamed                                                     |
| Segment  | The function segment used to build the custom curve in cases of LockupDynamic streams care |

### Secondary

| Entity | Description |
| ------ | ----------- |
| Watcher | A singleton data store for subgraph-level unique indexes such as the stream or action index

The following secondary entities were omitted from the Envio Indexer:

| Entity | Description |
| ------ | ----------- |
| Batch | An entity grouping a set of stream created all at once (action done through the `v2-periphery`)
| Batcher | An entity resolving 1:1 to a stream sender, in charge of managing the count of "batches" of streams one creates
