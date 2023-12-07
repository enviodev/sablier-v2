---
sidebar_position: 2
---

# Example Queries

Building on top of the entity structure defined earlier, here are some common GraphQL queries for fetching data from the Sablier V2 Envio Multi-Chain Indexer.


## Example 1

```graphql title="a) The 10 most recent streams across ALL chain deployments"
query MyQuery {
  Stream(limit: 10, order_by: { timestamp: desc }) {
    id
    alias
    category
    chainId
  }
}
```


```graphql title="b) The 10 most recent streams across ONE specific chain deployment (e.g. ETH mainnet chainId: 1)"
query MyQuery($_eq: numeric = "1") {
  Stream(limit: 10, order_by: {timestamp: desc}, where: {chainId: {_eq: $_eq}}) {
    id
    alias
    category
    chainId
  }
}
```

<!-- TO DO : add screenshot of result -->

## Example 2

```graphql title="a) Streams by sender (e.g. 0xAC7DD73B1F8CE885535783e753ae8A263425861A) across ALL chain deployments"
query MyQuery($_eq: String = "0xAC7DD73B1F8CE885535783e753ae8A263425861A") {
  Stream(where: {sender: {_eq: $_eq}}, order_by: {subgraphId: desc}) {
    id
    alias
    category
    chainId
  }
}
```

```graphql title="b) Streams by sender (e.g. 0xAC7DD73B1F8CE885535783e753ae8A263425861A) across ONE chain deployment (e.g. chainId: 1)"
query MyQuery($_eq: String = "0xAC7DD73B1F8CE885535783e753ae8A263425861A", $_eq1: numeric = "1") {
  Stream(where: {sender: {_eq: $_eq}, chainId: {_eq: $_eq1}}, order_by: {subgraphId: desc}) {
    id
    alias
    category
    chainId
  }
}

```

## Example 3

```graphql title="Lastest actions for a specific stream (e.g. 0x67422C3E36A908D5C3237e9cFfEB40bDE7060f6E-137-2)"
query MyQuery($_eq: String = "0x67422C3E36A908D5C3237e9cFfEB40bDE7060f6E-137-2") {
  Action(limit: 100, where: {stream: {_eq: $_eq}}, order_by: {subgraphId: desc}) {
    id
    category
    stream
  }
}
```

<!-- TO DO : add screenshot of result -->

