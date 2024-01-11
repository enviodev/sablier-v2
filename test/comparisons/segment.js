let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId = "0x39efdc3dbb57b2388ccc4bb40ac4cb1226bc9e44-1-10-1";

const subgraphQuery = `
query MyQuery {
    segment(id: "${testId}") {
      amount
      endAmount
      endTime
      exponent
      id
      milestone
      position
      startAmount
      startTime
      stream {
        id
      }
    }
  }
  
`;

const envioQuery = `
query MyQuery {
    Segment(where: {id: {_eq: "${testId}"}}) {
      amount
      endAmount
      endTime
      exponent
      id
      milestone
      position
      startAmount
      startTime
      stream
    }
  }  
`;

const compare = async () => {
  console.log("Segment comparison");
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
  logObjectDifference(graphData.segment, envioData.Segment[0]);
};

module.exports = { compare: compare };
