let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId =
  "0xe95bf047fc4500245ba9de72115a6cbe0e94094f166b89455e8221cf8605d8d7";

const subgraphQuery = `
query MyQuery {
    batch(id: "${testId}") {
      hash
      id
      label
      timestamp
      size
      streams {
        id
      }
      batcher {
        id
      }
    }
  }
  
`;

const envioQuery = `
query MyQuery {}
`;

const compare = async () => {
  console.log("Batch comparison");
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
  logObjectDifference(graphData.batch, envioData.Batch[0]);
};

module.exports = { compare: compare };
