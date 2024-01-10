let { logObjectDifference } = require("./helpers");
let { fetchQuery } = require("./fetcher");

const testId =
  "0x0073162fbb6f7aeec06d828204c9c57536bd76f721c2e95d9715f2090b290be4-175";

const subgraphQuery = `
query MyQuery {
  action(id: "${testId}") {
    addressA
    addressB
    amountA
    amountB
    block
    category
    chainId
    from
    hash
    id
    subgraphId
    timestamp
    contract {
      id
    }
    stream {
      id
    }
  }
}
`;

const envioQuery = `
query MyQuery {
  Action(where: {id: {_eq: "0x0073162fbb6f7aeec06d828204c9c57536bd76f721c2e95d9715f2090b290be4-175"}}) {
    addressA
    addressB
    amountA
    amountB
    block
    category
    chainId
    contract
    db_write_timestamp
    from
    hash
    id
    stream
    subgraphId
    timestamp
  }
}
`;

const compare = async () => {
  console.log("Action comparison");
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

  // to account for difference in thegraph / envio graphql api
  graphData.action.stream = graphData.action.stream.id;
  graphData.action.contract = graphData.action.contract.id;

  // compare data
  logObjectDifference(graphData.action, envioData.Action[0]);
};

module.exports = { compare: compare };
