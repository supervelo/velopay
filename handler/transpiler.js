// 1. tokenize statements // -
// 2. check for the connected words to find the statement purpose // -
// 3. find the relevant words out of the statement (nft name, token name)
// 4. Get the predefined metadata for the selected entity.
// 5. Contruct the transaction

// train word 2 vec model on the given txt file and the find the similarity
const {
    nftInfoExtracter,
    supportedNFTs,
    swapInfoExtractor,
    sendTokenInfoExtractor,
    supportTokenSend,
    supportedTokenSwap,
    bridgeInfoExtractor,
    supportedTokenSwapSolana,
    supportedTensorCollection,
    tensorInfoExtracter,
    tensorSwapQuery,
    streamInfoExtractor,
    supportedTokenStream,
} = require("./constants");
const { getResponse } = require("./gpt/llm");
const { isWordSimilar, isPairSimilar } = require("./utils/similarity");
const { constructNFTransaction } = require("./transactions/nftTransactions");
const { constructSendTransaction } = require("./transactions/tokenTransaction");
const { constructSwapTransaction } = require("./transactions/swapTransaction");
const {
    constructStreamTransaction,
} = require("./transactions/streamTransaction");
const {
    contructBridgeTransactionForStaking,
} = require("./transactions/bridgeAndStake");
const tensorQuery = require("./utils/tensorQuery");

const transpiler = async (currentStep, classifier, userAddress) => {
    const context = classifier.classify(currentStep);
    console.log("step context: ", context);

    // polygon mainnet and gnosis
    if (context === "swap") {
        const swapInfo = [];

        for (let i = 0; i < swapInfoExtractor.length; i++) {
            const resp = await getResponse(
                swapInfoExtractor[i].question,
                currentStep
            );
            if (i === 0) swapInfo.push(JSON.parse(resp));
            else swapInfo.push(resp);
        }

        console.log(swapInfo);

        let swapMeta;
        // order would always be correct in supportedTokenSwap

        // if(chain === "137") {
        //   console.log('we are here ', chain);
        //   swapMeta = supportedTokenSwap.filter(pair => isPairSimilar(pair.pair, swapInfo[0]));
        //   console.log('these are supportred tokens ', supportedTokenSwap);
        // }
        // else
        swapMeta = supportedTokenSwapSolana.filter((pair) =>
            isPairSimilar(pair.pair, swapInfo[0])
        );

        if (swapMeta.length === 0) return "Insufficient details for swap";
        console.log("this is swap meta ", swapMeta);

        let singlePair = swapMeta[0];
        // Naive check if the pair should be in reverse order
        // because maybe the gpt pair response is in reverse order
        if (singlePair.pair[0].toLowerCase() === swapInfo[0][0].toLowerCase()) {
            singlePair = {
                ...singlePair,
                pair: [singlePair.pair[1], singlePair.pair[0]],
            };
        }
        console.log(singlePair);

        const swapTransactionMeta = {
            pair: singlePair.pair,
            tokenIn: singlePair[singlePair.pair[0]],
            tokenOut: singlePair[singlePair.pair[1]],
            amount: swapInfo[1],
            userAddress,
        };

        const resp = await constructSwapTransaction(swapTransactionMeta);
        console.log(" this is resp ", resp);
        return { ...resp, type: "swap" };
    } else if (context === "nft_buy") {
        // Can you purchase me 1 Drop Nation DRiP NFT ?
        // nftInfoExtracter
        console.log("extracting info");

        const nftInfo = [];

        for (let i = 0; i < tensorInfoExtracter.length; i++) {
            const resp = await getResponse(
                tensorInfoExtracter[i].question,
                currentStep
            );
            nftInfo.push(resp);
        }

        // 0 -> name
        // 1 -> operation
        // 2 -> tokenId
        // 3 -> to
        const data = supportedTensorCollection.filter((d) =>
            isWordSimilar(d.name, nftInfo[0])
        );
        console.log(data);
        console.log(nftInfo[0]);
        if (data.length === 0) return "Insufficient details for nft operation";

        // Get query info for API call
        const nftMeta = data[0];
        const collectionSlug = nftMeta.slug;
        const activeListingsQuery = tensorSwapQuery.activeOrders.query;
        const activeListingVariable = tensorSwapQuery.activeOrders.variable;
        activeListingVariable["slug"] = collectionSlug;

        const res = await tensorQuery(
            activeListingsQuery,
            activeListingVariable
        );
        console.log(res);
        // 0 -> cheapest NFT available
        const tokenId = res.activeListingsV2.txs[0].mint.onchainId;
        const sellerId = res.activeListingsV2.txs[0].tx.sellerId;
        const grossAmount = res.activeListingsV2.txs[0].tx.grossAmount; // In lamports
        const nftTransactionData = {
            operation: "buy",
            name: nftMeta.name,
            slug: nftMeta.slug,
            tokenId: tokenId,
            owner: sellerId,
            amount: grossAmount,
            userAddress: userAddress,
            // toAddress: nftInfo[3],
        };

        const resp = await constructNFTransaction(nftTransactionData);
        console.log("this is resp", resp);

        return { ...resp, type: "nft_buy" };
    } else if (context === "nft_sell") {
        // TODO:
    } else if (context == "stream") {
        // streamInfoExtractor
        console.log("extracting info");

        const streamInfo = [];

        for (let i = 0; i < streamInfoExtractor.length; i++) {
            const resp = await getResponse(
                streamInfoExtractor[i].question,
                currentStep
            );
            streamInfo.push(resp);
        }
        console.log(streamInfo);
        // 0 -> token name
        // 1 -> recipent address
        // 2 -> token amount
        // 3 -> type of stream
        // 4 -> unlocking interval (enftInfovery second, minute,...)
        // 5 -> streaming duration -> 0: number, 1: duration(second, minute,...)
        const tokenData = supportedTokenStream.filter((d) =>
            isWordSimilar(d.name, streamInfo[0])
        );
        if (tokenData.length === 0)
            return "Insufficient details for nft operation";
        console.log(tokenData[0].address)
        const streamTransactionData = {
            operation: "stream",
            name: streamInfo[0],
            recipent: streamInfo[1],
            tokenId: tokenData[0].address,
            amount: streamInfo[2],
            streamType: streamInfo[3],
            unlockInterval: streamInfo[4],
            streamDuration: JSON.parse(streamInfo[5]),
            programId: tokenData[0].programId.devnet, // TODO: add support for choose cluster
            // toAddress: nftInfo[3],
        };

        const resp = await constructStreamTransaction(streamTransactionData);
        console.log("this is resp", resp);

        return { ...resp, type: "stream" };
    } else if (context === "transfer") {
        // polygon testnet
        console.log("extracting transfer info");

        const tokenSendInfo = [];
        for (let i = 0; i < sendTokenInfoExtractor.length; i++) {
            const resp = await getResponse(
                sendTokenInfoExtractor[i].question,
                currentStep
            );
            tokenSendInfo.push(resp);
        }

        // 0 -> name
        // 1 -> amount
        // 2 -> to address
        const sendTokenMeta = supportTokenSend.filter((data) =>
            isWordSimilar(data.name, tokenSendInfo[0])
        );

        if (sendTokenMeta.length === 0)
            return "Insufficient details for transfer";

        const sendTransactionData = {
            programAddress: sendTokenMeta[0].address,
            name: sendTokenMeta[0].name,
            fromAddress: userAddress,
            amount: tokenSendInfo[1],
            toAddress: tokenSendInfo[2],
        };

        console.log("sendTransactionData", sendTransactionData);
        const sendTransactionResp = await constructSendTransaction(
            sendTransactionData
        );
        console.log("sendTransactionResp", sendTransactionResp);

        return { ...sendTransactionResp, type: "transfer" };
    } else if (context === "staking") {
        // mumbai -> avalanche
        let tokenAmount = 0;
        // 0 -> token amount
        tokenAmount = await getResponse(
            bridgeInfoExtractor[0].question,
            currentStep
        );

        if (tokenAmount === "-") {
            return {
                success: false,
                transactions: [],
            };
        }

        const bridgeTransactionData = {
            amount: tokenAmount,
            userAddress,
        };

        console.log("bridge data ", bridgeTransactionData);

        let bridgeTxnResp = await contructBridgeTransactionForStaking(
            bridgeTransactionData
        );
        console.log("txn ", bridgeTxnResp);
        return { ...bridgeTxnResp, type: "bridge" };
    }
};

module.exports = { transpiler };
