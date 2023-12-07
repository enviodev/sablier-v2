---
sidebar_position: 2
---

# Example Queries

Building on top of the entity structure defined earlier, here are some common GraphQL queries for fetching data from the Sablier V2 Envio Multi-Chain Indexer.

The same query is run against Sablier's current Sablier V2 subgraph deployment to validate data correctness.

## Example 1

### Using Envio

```graphql title="The 10 most recent streams on ALL chains"
streams(
  first: 10
  orderBy: timestamp
  orderDirection: desc
) {
  id
  alias
  category
}
```

<!-- TO DO : add screenshot of result -->


```graphql title="The 10 most recent streams on one chain (e.g. Ethereum Mainnet)"
streams(
  first: 10
  orderBy: timestamp
  orderDirection: desc
) {
  id
  alias
  category
  chainid
}
```
<!-- TO DO : add screenshot of result -->

### Using Subgraph


<!-- TO DO : add screenshot of result -->

## Example 2

### Using Envio 


<!-- TO DO : add screenshot of result -->

### Using Subgraph

```graphql title="Streams created by an address (sender)"
streams(
  first: $first
  skip: $skip
  orderBy: $subgraphId
  orderDirection: desc
  where: {
    or: [
      { and: [{ sender: $sender }, { subgraphId_lt: $subgraphId }] }
      { and: [{ proxender: $sender }, { subgraphId_lt: $subgraphId }] }
    ]
  }
) {
  id
  alias
  category
}
```

<!-- TO DO : add screenshot of result -->

## Example 3

### Using Envio 

<!-- TO DO : add screenshot of result -->

### Using Subgraph 

```graphql title="Most recent 100 stream actions such as withdrawals or transfers"
actions(
  first: 100
  orderBy: subgraphId # Action's subgraph id
  orderDirection: desc
  where: { stream: $streamId }
) {
  id
  category
  stream {
    id
    alias
    category
  }
}
```

<!-- TO DO : add screenshot of result -->