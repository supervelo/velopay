const { LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const Axios = require('axios')
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Wallet } from '@project-serum/anchor';
import bs58 from 'bs58';

const constructBracketOrderTransaction = async (bracketData) => {
    console.log('this is swap data', bracketData);
    const pair = bracketData.pair;

    // Base key are used to generate a unique order id
    const base = Keypair.generate();

    // get a price router before constructing transaction

    // get serialized transactions
    const transactions = await (
    await fetch('https://jup.ag/api/limit/v1/createOrder', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        owner: wallet.publicKey.toString(),
        inAmount: bracketData.fullAmount, // 1000000 => 1 USDC if inputToken.address is USDC mint
        outAmount: bracketData.previousSwapAmount * 0.5,
        inputMint: bracketData.pair[1],
        outputMint: bracketData.pair[0],
        expiredAt: null, // new Date().valueOf() / 1000,
        base: bracketData.userAddress,
        // referralAccount and name are both optional
        // provide both to get referral fees
        // more details in the section below
        referralAccount: referral.publicKey.toString(),
        referralName: "Referral Name"
        })
    }),
    await fetch('https://jup.ag/api/limit/v1/createOrder', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        owner: wallet.publicKey.toString(),
        inAmount: bracketData.fullAmount * 0.55, // 1000000 => 1 USDC if inputToken.address is USDC mint
        outAmount: bracketData.previousSwapAmount * 0.55 * 1.8,
        inputMint: bracketData.pair[1],
        outputMint: bracketData.pair[0],
        expiredAt: null, // new Date().valueOf() / 1000,
        base: bracketData.userAddress,
        // referralAccount and name are both optional
        // provide both to get referral fees
        // more details in the section below
        referralAccount: referral.publicKey.toString(),
        referralName: "Referral Name"
        })
    })
    ).json();

    console.log(transactions)
    const { tx } = transactions;
    
    return tx;
}