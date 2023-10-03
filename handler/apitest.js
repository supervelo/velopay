// TODO:
const axios = require('axios'); // legacy way/**
/*From onchainId, check if it is listed. If listed, return its metadata(sellerId, grossAmount) If not listed, return  empty value
 * @param onchainId: Id of the NFT
 * @param txs: Metadata of listing NFT in a particular collection
 */

function retriveMintInfo(onchainId, txs) {
  for (let i = 0; i < txs.length; i++) {
    if (txs[i].mint.onchainId == onchainId) {
      console.log("Found given NFT on listing");
      console.log(onchainId);
      return;
    }
  }
  console.log("NFT not found");
}
// Get the lowest price nft in the collection
(async () => {
  try {
    const { data } = await axios.post(
      "https://api.tensor.so/graphql",
      {
        query: `query ActiveListingsV2(
            $slug: String!
            $sortBy: ActiveListingsSortBy!
            $filters: ActiveListingsFilters
            $limit: Int
            $cursor: ActiveListingsCursorInputV2
          ) {
            activeListingsV2(
              slug: $slug
              sortBy: $sortBy
              filters: $filters
              limit: $limit
              cursor: $cursor
            ) {
              page {
                endCursor {
                  str
                }
                hasMore
              }
              txs {
                mint {
                  onchainId
                }
                tx {
                  sellerId
                  grossAmount
                  grossAmountUnit
                }
              }
            }
          }`,
        variables: {
          slug: "a12fcd5d-2067-4e10-8ca2-e7ab4b342e32",
          sortBy: "PriceAsc",
          filters: {
            sources: ["TENSORSWAP", "TCOMP"],
          },
          limit: 1, // Max: 250
          // To get more results, pass `page.endCursor` from the response
          cursor: null,
        },
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
    retriveMintInfo(
      "77mmcFGGqdXjjXH1xjU8sZa2Ty3Cd3M7QwoEvkjii5at",
      data.data.activeListingsV2.txs
    );
  } catch (err) {
    // Any errors.
    if (err instanceof axios.AxiosError) console.log(err.response?.data.errors);
    else console.error(err);
  }
})();
