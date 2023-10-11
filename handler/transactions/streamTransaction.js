const {
    clusterApiUrl,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    Connection,
} = require("@solana/web3.js");
const { createStreamParams } = require("../utils/streamFlow");
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
const constructStreamTransaction = async (streamMeta) => {
    const {
        name,
        recipent,
        tokenId,
        amount,
        streamType,
        unlockInterval,
        streamDuration,
    } = streamMeta;
    return {
        success: true,
        context: `This transaction might create a wSOL account which would convert ${amount} SOL to ${amount} WSOL(Wrapped SOL) and then \n create a stream ${streamType} of ${amount} ${name} token from your Solana account to ${recipent} that will unlock every ${unlockInterval} that last ${streamDuration[0]} ${streamDuration[1]}`,
        transaction: [
            {
                to: streamMeta.programId,
                data: streamMeta,
                value: streamMeta.amount,
            },
        ],
    };
};

module.exports = { constructStreamTransaction };
