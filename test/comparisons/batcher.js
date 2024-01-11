let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId = "0x02bff5a26ef876d5307a653f21e355ce9562c4b0";

const subgraphQuery = `
query MyQuery {
    batcher(id: "0x02bff5a26ef876d5307a653f21e355ce9562c4b0") {
      address
      batchIndex
      id
      batches {
        id
      }
    }
  }  
`;

const envioQuery = `
query MyQuery {}
`;

const compare = async () => {
  console.log("Batcher comparison");
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
  logObjectDifference(graphData.batcher, envioData.Batcher[0]);
};

module.exports = { compare: compare };
