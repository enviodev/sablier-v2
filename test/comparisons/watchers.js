let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId = 1;

const subgraphQuery = `
  query MyQuery {
    watcher(id: ${testId}) {
      actionIndex
      chainId
      id
      initialized
      logs
      streamIndex
    }
  }
`;

const envioQuery = `
  query MyQuery {
    Watcher(where: {id: {_eq: "${testId}"}}) {
      actionIndex
      chainId
      id
      initialized
      logs
      streamIndex
    }
  }
`;

const compare = async () => {
  console.log("Watcher comparison");
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
  logObjectDifference(graphData.watcher, envioData.Watcher[0]);
};

module.exports = { compare: compare };
