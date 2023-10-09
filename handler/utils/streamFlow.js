const {
    StreamflowSolana,
    Types,
    GenericStreamClient,
    getBN,
    getNumberFromBN,
} = require("@streamflow/stream");
const { BN } = require("bn.js");

/**
 *
 * @param {string} recipent
 * @param {string} tokenId Mint address of the token
 * @param {number} amount normal number e.g 0.1 SOL
 * @param {string} period "second", "minute", "hour", "day", "month", "quarter", "year"
 * @param {boolean} canTopup True -> Payment, False -> Vesting
 *
 * @returns {object}
 */
function createStreamParams(recipent, tokenId, amount, period, canTopup) {
    const typeOfStream = canTopup ? "Payment" : "Vesting";
    const streamParams = {
        recipient: recipent.toString(), // Recipient address.
        tokenId: tokenId, // Token mint address.
        start: getTimestamp() + 10, // Timestamp (in seconds) when the stream/token vesting starts.
        amount: getBN(amount, 9), // depositing amount tokens with 9 decimals mint.
        period: getTimeStep(period), // Time step (period) in seconds per which the unlocking occurs.
        cliff: getTimestamp() + 25, // Vesting contract "cliff" timestamp in seconds.
        cliffAmount: new BN(0), // Amount unlocked at the "cliff" timestamp.
        amountPerPeriod: getBN(0.00001, 9), // Release rate: how many tokens are unlocked per each period.
        name: `Streaming ${typeOfStream}`, // The stream name or subject.
        canTopup: canTopup, // setting to FALSE will effectively create a vesting contract.
        cancelableBySender: true, // Whether or not sender can cancel the stream.
        cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
        transferableBySender: true, // Whether or not sender can transfer the stream.
        transferableByRecipient: false, // Whether or not recipient can transfer the stream.
        automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
        withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
        partner: undefined, //  (optional) Partner's wallet address (string | undefined).
    };
    return streamParams;
}
const getTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};
module.exports = { createStreamParams };
