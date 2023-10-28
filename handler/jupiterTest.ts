import {
    CloseDCAParams,
    DCA,
    Network,
    type CreateDCAParamsV2,
    type DepositParams,
    type WithdrawParams,
} from "@jup-ag/dca-sdk";
import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
const { supportedTokenSwapSolana } = require("./constants");
const connection = new Connection("https://api.mainnet-beta.solana.com");

const dca = new DCA(connection, Network.MAINNET);
const USDC = new PublicKey(supportedTokenSwapSolana[0].USDC.mint);
const WSOL = new PublicKey(supportedTokenSwapSolana[0].SOL.mint);

async function createDCA(userAddress: PublicKey) {
    const params: CreateDCAParamsV2 = {
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

// // this is for withdrawing from program ATA
// async function withdraw(dcaPubKey) {
//     // it's possible to withdraw in-tokens only or out-tokens only or both in and out tokens together. See WithdrawParams for more details
//     const params: WithdrawParams = {
//         user: user.publicKey,
//         dca: dcaPubKey,
//         inputMint: USDC,
//         withdrawInAmount: BigInt(1_000_000),
//     };

//     const { tx } = await dca.withdraw(params);

//     const txid = await sendAndConfirmTransaction(connection, tx, [user]);

//     console.log("Withdraw: ", { txid });
// }

// async function closeDCA(dcaPubKey) {
//     const params: CloseDCAParams = {
//         user: user.publicKey,
//         dca: dcaPubKey,
//     };

//     const { tx } = await dca.closeDCA(params);

//     const txid = await sendAndConfirmTransaction(connection, tx, [user]);

//     console.log("Close DCA: ", { txid });
// }

// async function main() {
//     const dcaPubKey = await createDCA();
//     console.log("DCA Pub Key: ", { dcaPubKey });

//     const dcaAccount = await dca.fetchDCA(dcaPubKey);
//     console.log("DCA Account Data: ", { dcaAccount });

//     const dcaAccounts = await dca.getCurrentByUser(user.publicKey);
//     console.log({ dcaAccounts });

//     await dca.getBalancesByAccount(dcaPubKey);

//     await withdraw(dcaPubKey);

//     await closeDCA(dcaPubKey);
// }
async function main() {
    const testPubKey = new PublicKey(
        "9gogWRPeN1DN2o6FFv73X5rFYhHGunq7EJHua8A7inqh"
    );
    const dcaPubKey = await createDCA(testPubKey);
}
main();
