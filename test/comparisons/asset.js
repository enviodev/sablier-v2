let { logObjectDifferenceDetailed } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId = "0x08ba718f288c3b12b01146816bef9fa03cc635bc";

const subgraphQuery = `
query MyQuery {
    asset(id: "${testId}") {
      address
      chainId
      decimals
      id
      name
      symbol
      streams {
        id
      }
    } 
  }
`;

const subgraphQueryAll = `
query MyQuery {
    assets(orderBy: id, orderDirection: asc) {
      address
      chainId
      decimals
      id
      name
      symbol
      streams {
        id
      }
    } 
  }
`;

const envioQuery = `
query MyQuery {
    Asset(where: {id: {_eq: "${testId}"}}) {
      address
      chainId
      id
      streams {
        id
      }
    }
  }
  
`;

const envioQueryAll = `
query MyQuery {
    Asset(order_by: {id: asc}) {
      address
      chainId
      id
      streams {
        id
      }
    }
  }
  
`;

const compare = async () => {
  console.log("Asset comparison");
  // fetch data from theGraph by Id
  let graphData = await fetchQuery(
    "https://api.thegraph.com/subgraphs/name/sablier-labs/sablier-v2",
    subgraphQuery
  );

  // fetch data from envio by Id
  let envioData = await fetchQuery(
    "http://localhost:8080/v1/graphql",
    envioQuery
  );

  // compare data
  console.log("test: the asset with id ", testId, " should be equal");
  logObjectDifferenceDetailed("asset", graphData.asset, envioData.Asset[0]);

  // fetch data from theGraph
  let graphDataAll = await fetchQuery(
    "https://api.thegraph.com/subgraphs/name/sablier-labs/sablier-v2",
    subgraphQueryAll
  );

  // fetch data from envio
  let envioDataAll = await fetchQuery(
    "http://localhost:8080/v1/graphql",
    envioQueryAll
  );

  console.log("test: all assets ", testId, " should be equal");
  graphDataAll.assets.forEach((asset, index) => {
    logObjectDifferenceDetailed("asset", asset, envioDataAll.Asset[index]);
  });
};

module.exports = { compare: compare };
