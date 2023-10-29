const {
    clusterApiUrl,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    Connection,
} = require("@solana/web3.js");
const { createDCATx } = require("../utils/jupiter");
/*
const streamTransactionData = {
            operation: "stream",
            name: streamInfo[0],
            recipent: streamInfo[1],
            tokenId: tokenData[1],
            amount: streamInfo[2],
            streamType: streamInfo[3],
            unlockInterval: streamInfo[4],
            streamDuration: streamInfo[5],
            // toAddress: nftInfo[3],
        };
*/
const constructDCATransaction = async (DCAMeta) => {
    const { userAddress, amount, programId } = DCAMeta;
    const tx = createDCATx(new PublicKey(userAddress));
    return {
        success: true,
        context: `This transaction will do a DCA swap of ${amount} USDC to SOL every day over the period of 5 days`,
        transaction: [
            {
                to: DCAMeta.programId,
                data: tx,
                value: amount,
            },
        ],
    };
};

module.exports = { constructDCATransaction };
