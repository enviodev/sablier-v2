---
sidebar_position: 3
---

# Development

This repo contains the Sablier V2 Envio Multi-chain indexer built using TypeScript for all Sablier mainnet contracts.

The indexer has been built using v0.0.25 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/sablier-v2)
2. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
3. Install Envio via `npm i -g envio@v0.0.25`
4. Generate indexing code via `envio codegen`
5. Run the indexer via `envio dev` (make sure you have Docker running)
6. Stop the indexer via `envio stop`