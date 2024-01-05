let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

// const testId = "0x39efdc3dbb57b2388ccc4bb40ac4cb1226bc9e44-1-1"; // LD
// const testId = "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-1"; // LL
const testId = "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-5";

const subgraphQuery = `
  query MyQuery {
    stream(id:  "${testId}") {
      id
      alias
      cancelable
      canceled
      canceledTime
      category
      chainId
      cliff
      cliffAmount
      cliffTime
      depositAmount
      duration
      endTime
      funder
      hash
      intactAmount
      parties
      position
      protocolFeeAmount
      proxender
      proxied
      recipient
      renounceTime
      sender
      startTime
      subgraphId
      timestamp
      tokenId
      transferable
      version
      withdrawnAmount
      canceledAction
      brokerFeeAmount
      asset
      contract
      renounceAction
    }
  }
`;

const envioQuery = `
  query MyQuery {
    Stream(where: {id: {_eq: "${testId}"}}) {
      id
      alias
      cancelable
      canceled
      canceledTime
      category
      chainId
      cliff
      cliffAmount
      cliffTime
      depositAmount
      duration
      endTime
      funder
      hash
      intactAmount
      parties
      protocolFeeAmount
      proxender
      proxied
      recipient
      renounceTime
      sender
      startTime
      subgraphId
      timestamp
      tokenId
      transferable
      version
      withdrawnAmount
      canceledAction
      brokerFeeAmount
      asset
      contract
      renounceAction
    }
  }
`;

const compare = async () => {
  // fetch data from theGraph by Id
  let graphData = await fetchQuery(
    "https://api.thegraph.com/subgraphs/name/sablier-labs/sablier-v2",
    subgraphQuery
  );
  // fetch data from hasura by Id
  let envioData = await fetchQuery(
    "http://localhost:8080/v1/graphql",
    envioQuery
  );

  // compare data
  logObjectDifference(graphData.stream, envioData.Stream[0]);
};

module.exports = { compare: compare };
