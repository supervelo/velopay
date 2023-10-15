const { LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const Axios = require('axios')

const constructSwapTransaction = (swapData) => {
  console.log('this is swap data', swapData);
  const pair = swapData.pair;

  return constructSolanaSwapTransaction(swapData)
}

const constructSolanaSwapTransaction = async (swapData) => {
  let transactions = [];

  // Retrieve the `indexed-route-map`
  const indexedRouteMap = await (await fetch('https://quote-api.jup.ag/v6/indexed-route-map')).json();
  const getMint = (index) => indexedRouteMap["mintKeys"][index];
  const getIndex = (mint) => indexedRouteMap["mintKeys"].indexOf(mint);

  // Generate the route map by replacing indexes with mint addresses
  var generatedRouteMap = {};
  Object.keys(indexedRouteMap['indexedRouteMap']).forEach((key, index) => {
    generatedRouteMap[getMint(key)] = indexedRouteMap["indexedRouteMap"][key].map((index) => getMint(index))
  });

  // List all possible input tokens by mint address
  const allInputMints = Object.keys(generatedRouteMap);

  // List all possition output tokens that can be swapped from the mint address for SOL.
  // SOL -> X
  const swappableOutputForSOL = generatedRouteMap['So11111111111111111111111111111111111111112'];
  // console.log({ allInputMints, swappableOutputForSOL })

  const quoteResponse = await (
    await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${swapData.tokenIn.mint}&outputMint=${swapData.tokenOut.mint}&amount=${Math.pow(10, swapData.tokenIn.decimals) * swapData.amount}&slippageBps=50`)
    // await fetch('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=60000000&slippageBps=50')
  ).json();
  console.log({ quoteResponse })

  // get serialized transactions for the swap
  const transaction = await (
    await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse,
        // user public key to be used for the swap
        userPublicKey: new PublicKey(swapData.userAddress).toBase58(),
        // auto wrap and unwrap SOL. default is true
        wrapUnwrapSOL: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      })
    })
  ).json();

  console.log(transaction)
  const { swapTransaction } = transaction

  transactions.push(swapTransaction);

  return {
    success: true,
    context: `This transactions would swap your ${swapData.amount} of ${swapData.pair[0]} token against ${swapData.pair[1]} token. Would you like to place TP 1.8x with 55% and SL 0.5x with 100% on this transaction? Press 'Ok' if you only want to swap the tokens instantly.`,
    transaction: transactions
  };
}

const constructERC20SwapTransaction = async (swapData) => {
  /**
   * Data we need
   * 1. token pair // default to USDC and USDT
   * 2. token amount // by user
   */

  const chain = swapData.chain;

  let transactions = [];
  console.log('this is swap data ', swapData);

  // first give approval to 1inch router for the transaction
  let approvalTxnResp = await Axios.get(approveUrl(chain), {
    params: {
      tokenAddress: swapData.tokenAddress1,
      amount: ethers.utils
      .parseUnits(swapData.amount, 6)
      .toString()
    }
  });

  transactions.push(approvalTxnResp.data);
  // console.log(approvalTxnResp.data);
  console.log('these are params ', {
    fromTokenAddress: swapData.tokenAddress1,
    toTokenAddress: swapData.tokenAddress2,
    amount: ethers.utils
    .parseUnits(swapData.amount, 6)
    .toString(),
    fromAddress: swapData.userAddress,
    slippage: 40, // hardcoding it for now
    disableEstimate: true,
    // destReceiver: swapData.userAddress
  })
  // swap transction
  let swapTransactionResp = await Axios.get(swapUrl(chain), {
    params: {
      fromTokenAddress: swapData.tokenAddress1,
      toTokenAddress: swapData.tokenAddress2,
      amount: ethers.utils
      .parseUnits(swapData.amount, 6)
      .toString(),
      fromAddress: swapData.userAddress,
      slippage: 40, // hardcoding it for now
      disableEstimate: true,
      // destReceiver: swapData.userAddress
    }
  })

  console.log(swapTransactionResp)

  const swapTxns = {
    to: swapTransactionResp.data.tx.to,
    value: swapTransactionResp.data.tx.value,
    data: swapTransactionResp.data.tx.data,
    gasPrice: swapTransactionResp.data.tx.gasPrice
  }

  transactions.push(swapTxns);

  return {
    success: true,
    context: `The first transaction would take approval for ${swapData.amount} of ${swapData.pair[1].toUpperCase()} token and then it would swap ${swapData.amount} of ${swapData.pair[0].toUpperCase} token for best rates`,
    transaction: transactions
  }
}

module.exports = { constructSwapTransaction }
