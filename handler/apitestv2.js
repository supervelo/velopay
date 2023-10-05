// TODO:
const axios = require("axios");
const { tensorSwapQuery } = require("./constants");
const buyNFTFromListingQuery = tensorSwapQuery.buyNFTFromListing.query
  const buyNFTFromListingVariable = tensorSwapQuery.buyNFTFromListing.variable
  buyNFTFromListingVariable["buyer"] = "9gogWRPeN1DN2o6FFv73X5rFYhHGunq7EJHua8A7inqh"
  buyNFTFromListingVariable["maxPrice"] = "670000"
  buyNFTFromListingVariable["mint"] = "52HAm7sxKoo7JgEQNTywi34QeqVxUWXxKTdjyUpfQqk9"
  buyNFTFromListingVariable["owner"] = "GKbaEiiNnvghQ8essyZFRZXu2pdDkZnJwCWCQzZ8Agvp";
(async () => {
  try {
    const { data } = await axios.post(
      "https://api.tensor.so/graphql",
      {
        query: tensorSwapQuery.buyNFTFromListing.query,
        variables: buyNFTFromListingVariable
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-TENSOR-API-KEY":
            process.env.TENSOR_API_KEY ??
            "",
        },
      }
    );

    // Query response (if no errors)
    console.log(data);
  } catch (err) {
    // Any errors.
    if (err instanceof axios.AxiosError) console.log(err.response?.data.errors);
    else console.error(err);
  }
})();
