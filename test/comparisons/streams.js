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
    }
  }
`;

const fetchGraphQL = async (endpoint, query, operationName, variables) => {
  const result = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
};

const fetchTheGraphQuery = async () => {
  const { errors, data } = await fetchGraphQL(
    "https://api.thegraph.com/subgraphs/name/sablier-labs/sablier-v2",
    subgraphQuery,
    "MyQuery",
    {}
  );

  if (errors) {
    console.log("error fetching from the graph");
    console.error(errors);
  }

  return data;
};

const fetchEnvioQuery = async () => {
  const { errors, data } = await fetchGraphQL(
    "http://localhost:8080/v1/graphql",
    envioQuery,
    "MyQuery",
    {}
  );

  if (errors) {
    console.log("error fetching from envio");
    console.error(errors);
  }

  return data;
};

/////////////////////////////

function logObjectDifference(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  const uniqueKeys = new Set([...keys1, ...keys2]);

  uniqueKeys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      console.log(`Difference in key '${key}':`);
      console.log(`   Graph data: ${obj1[key]}`);
      console.log(`   Envio data: ${obj2[key]}`);
    }
  });
}

const compare = async () => {
  // fetch data from theGraph by Id
  let graphData = await fetchTheGraphQuery();
  // fetch data from hasura by Id
  let envioData = await fetchEnvioQuery();
  // compare data

  logObjectDifference(graphData.stream, envioData.Stream[0]);
};

module.exports = { compare: compare };
