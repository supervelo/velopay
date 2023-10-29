/**
 *
 * @param {PublicKey} userAddress
 * @returns {PublicKey}
 */
async function createDCATx(userAddress) {
    const params = {
        payer: userAddress.toString(), // could have a different account pay for the tx (make sure this account is also a signer when sending the tx)
        user: userAddress.toString(),
        inAmount: BigInt(1_000_000), // buy a total of 5 USDC over 5 days
        inAmountPerCycle: BigInt(200_000), // buy using 1 USDC each day
        cycleSecondsApart: BigInt(86400), // 1 day between each order -> 60 * 60 * 24
        inputMint: USDC, // sell
        outputMint: WSOL, // buy
        minOutAmountPerCycle: null, // effectively allows for a min price. refer to Integration doc
        maxOutAmountPerCycle: null, // effectively allows for a max price. refer to Integration doc
        startAt: null, // unix timestamp in seconds
        userInTokenAccount: undefined, // optional: if the inputMint token is not in an Associated Token Account but some other token account, pass in the PublicKey of the token account, otherwise, leave it undefined
    };

    const { tx, dcaPubKey } = await dca.createDcaV2(params);
    // const txid = await sendAndConfirmTransaction(connection, tx, [user]);

    console.log("Create DCA: ", { tx });

    return dcaPubKey;
}
module.exports = { createDCATx };
