let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId = "0xB10daee1FCF62243aE27776D7a92D39dC8740f95".toLowerCase();

const subgraphQuery = `
  query MyQuery {
    contract(id: "${testId}") {
      address
      admin
      alias
      category
      id
      version
      streams
    }
  }
`;

const envioQuery = `
query MyQuery {
  Contract(where: {id: {_eq: "${testId}"}}) {
    address
    admin
    alias
    category
    chainId
    chainName
    version
    id
  }
}
`;

const compare = async () => {
  console.log("Contracts comparison");
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
  logObjectDifference(graphData.contract, envioData.Contract[0]);
};

module.exports = { compare: compare };
