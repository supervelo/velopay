const axios = require("axios");

async function tensorQuery(query, variable){

  try {
    const { data } = await axios.post(
      "https://api.tensor.so/graphql",
      {
        query: query,
        variables: variable,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-TENSOR-API-KEY": process.env.TENSOR_API_KEY ?? "",
        },
      }
    );
    // Query response (if no errors)
    return data.data
  } catch (err) {
    // Any errors.
    if (err instanceof axios.AxiosError) console.log(err.response?.data.errors);
    else console.error(err);
  }
}
module.exports = tensorQuery
