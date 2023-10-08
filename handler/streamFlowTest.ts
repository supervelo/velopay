import { BN } from "bn.js";
import {
    StreamflowSolana,
    Types,
    GenericStreamClient,
    getBN,
    getNumberFromBN,
} from "@streamflow/stream";
import { Connection, Keypair, Signer } from "@solana/web3.js";
import { base58 } from "ethers/lib/utils";
import bs58 from "bs58";
import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();
const solanaClient = new StreamflowSolana.SolanaStreamClient(
    clusterApiUrl("devnet"),
    undefined,
    undefined,
    "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ"
);

// GetTimestamp (in seconds) when the stream/token vesting starts
const getTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};
// Needed arguments:
// + First, AI need to successfully identify the query as "stream" intent
// Then, these arguments are needed
// + (provided) Keypair of user(for signing tx, paying fees when create stream)
// + Recipent address(AI)
// + (Not sure) ATA of Recipents and Sender -> create on our end.
// + Amount of money(AI)
// + Token Identifier(AI)
// + unlock interval(AI)
// + Duration to unlock(AI)
// + (Optional) Cliff percentage(AI)
(async () => {
    const wallet = Keypair.fromSecretKey(
        bs58.decode(process.env.TESTING_PRIVATE_KEY || "")
    );
    // ATA of the sender: E2nVcyVMnuCVf7o1JRjvH8m4G3fwzumkkuizBbZiAuy6
    let connection = new Connection(clusterApiUrl("devnet"), {
        commitment: "confirmed",
    });
    let mint = new PublicKey("So11111111111111111111111111111111111111112");
    let owner = new PublicKey("4WMjxRZ1HhX4RhZ1fiohpwUTmjeCudQhwYogzvqHKSjh");
    const recipentId = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        owner
    );
    const senderId = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        wallet.publicKey
    );
    console.log(getBN(1, 4));
    console.log(recipentId.address.toString());
    const solanaParams: StreamflowSolana.ICreateStreamSolanaExt = {
        sender: wallet, // SignerWalletAdapter or Keypair of Sender account
        // isNative: // [optional] [WILL CREATE A wSOL STREAM] Wether Stream or Vesting should be paid with Solana native token or not
    };
    const createStreamParams: Types.ICreateStreamData = {
        recipient: owner.toString(), // Recipient address.
        tokenId: "So11111111111111111111111111111111111111112", // Token mint address.
        start: getTimestamp() + 10, // Timestamp (in seconds) when the stream/token vesting starts.
        amount: getBN(1, 9), // depositing 100 tokens with 9 decimals mint.
        period: 1, // Time step (period) in seconds per which the unlocking occurs.
        cliff: getTimestamp() + 15, // Vesting contract "cliff" timestamp in seconds.
        cliffAmount: new BN(0), // Amount unlocked at the "cliff" timestamp.
        amountPerPeriod: getBN(0.00001, 9), // Release rate: how many tokens are unlocked per each period.
        name: "Transfer to d Account.", // The stream name or subject.
        canTopup: true, // setting to FALSE will effectively create a vesting contract.
        cancelableBySender: true, // Whether or not sender can cancel the stream.
        cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
        transferableBySender: true, // Whether or not sender can transfer the stream.
        transferableByRecipient: false, // Whether or not recipient can transfer the stream.
        automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
        withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
        partner: undefined, //  (optional) Partner's wallet address (string | undefined).
    };
    const { ixs, txId, metadataId } = await solanaClient.create(
        createStreamParams,
        solanaParams
    ); // second argument differ depending on a chain
    console.log(`${ixs}\n${txId}\n${metadataId}`);

    // const cancelStreamParams: Types.ICancelD    commitment: "confirmed",NpzYendxmtzvVh", // Identifier of a stream to be canceled.
    // };
    // const data: Types.IGetOneData = {
    //     id: "8WgiQ5BHTKD6BZV7ogUZpVRkvmo8XkNpzYendxmtzvVh", // Identifier of a stream
    // };
    // const stream = await solanaClient.getOne({
    //     id: "AAAAyotqTZZMAAAAmsD1JAgksT8NVAAAASfrGB5RAAAA",
    // });
    // const withdrawn = stream.withdrawnAmount; // bn amount withdrawn already
    // console.log(getNumberFromBN(withdrawn, 9));
    // const remaining = stream.unlocked(9); // amount of remaining funds
    // console.log(remaining);
    // const solanaParams = {
    //     invoker: wallet, // SignerWalletAdapter or Keypair signing the transaction
    // };
    // const { ixs, txId } = await solanaClient.cancel(
    //     cancelStreamParams,
    //     solanaParams
    // );
    // console.log(txId);
})();
