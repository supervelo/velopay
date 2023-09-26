const {
    clusterApiUrl,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    Connection
} = require('@solana/web3.js')
const constructSendTransaction = async (transferMeta) => {

    if(transferMeta.toAddress === '-' || transferMeta.amount === '-') {
        return {
            success: false,
            transaction: {},
          };      
    }   


    // if(transferMeta.address === '-') {
    //     return {
    //         success: true,
    //         context: `This transaction would transfer ${transferMeta.amount} amount of matic token from your ethereum account to ${transferMeta.toAddress} ethereum account.` ,
    //         transaction: [{
    //             to: transferMeta.toAddress,
    //             value: ethers.utils.parseEther(transferMeta.amount),
    //             data: '0x'
    //         }]
    //     }
    // }

    // Remember to pass PublicKey instance to the transfer function, not String
    const fromPubKey = new PublicKey(transferMeta.fromAddress)
    const toPubKey = new PublicKey(transferMeta.toAddress)
    const solAmount = transferMeta.amount

    const tx = new Transaction().add(SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: solAmount * LAMPORTS_PER_SOL

    }));

    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
    const blockHash = (await connection.getLatestBlockhash('finalized')).blockhash
    tx.feePayer = fromPubKey
    tx.recentBlockhash = blockHash

    const serializedTransaction = tx.serialize({requireAllSignatures: false, verifySignatures: true});
    const transactionBase64 = serializedTransaction.toString('base64');
    return {
        success: true,
        context: `This transaction would transfer ${transferMeta.amount} of ${transferMeta.name} token from your Solana account to ${transferMeta.toAddress}.` ,
        transaction: [{
            to: transferMeta.fromAddress,
            data: transactionBase64,
            value: 0
        }]
    }
}

module.exports = { constructSendTransaction }