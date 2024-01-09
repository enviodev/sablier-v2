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

const fetchQuery = async (endpoint, query) => {
  const { errors, data } = await fetchGraphQL(endpoint, query, "MyQuery", {});

  if (errors) {
    console.log(`error fetching data from ${endpoint}`);
    console.error(errors);
  }

  return data;
};

module.exports = { fetchQuery };
