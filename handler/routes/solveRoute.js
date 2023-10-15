const express = require('express')
const router = express.Router();
const { transpiler } = require('../transpiler')
const { getClassifier } = require('../classifier/classifier')

const path = require('path');
const { HNSWLib } = require('langchain/vectorstores');
const { OpenAIEmbeddings } = require('langchain/embeddings');
const { makeChain } = require('../utils/makeChain');

const currentStep =
    // "Can you mint a BAYC NFT for me";
    // "Can you transfer this BAYC NFT to this address 0x288d1d682311018736B820294D22Ed0DBE372188"
    "Can you please send 15 USDC token to this address 0xE153aa7d78036f90B5155FBE3b7BbC337b50DF65"

    
router.post('/', async (req, res) => {

    const body = req.body;
    const dir = path.resolve(process.cwd(), "embeddingData");

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      // Important to set no-transform to avoid compression, which will delay
      // writing response chunks to the client.
      // See https://github.com/vercel/next.js/issues/9965
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    });

    const sendData = (data) => {
      res.write(`data: ${data}\n\n`);
    };

    // Send initial data so browsers know SSE is connected
    sendData(JSON.stringify({ data: "" }));

    let txn;
    try {
      const classifier = await getClassifier();
      txn = await transpiler(body.question, classifier, body.userAddress);
    } catch (err) {
      console.log(err);
      sendData(JSON.stringify({ data: err }));
    }

    if (txn.success === true) {

      sendData(JSON.stringify({ data: txn }));
      setTimeout(() => {
        sendData("[DONE]");
        res.end();
      }, 2000)

    } else {
      // Using Q&A model
      const vectorstore = await HNSWLib.load(dir, new OpenAIEmbeddings());
      const chain = makeChain(vectorstore, async (token, runId, parentRunId) => {
        sendData(JSON.stringify({ data: token }));
      });

      try {
        await chain.call({
          question: body.question,
          chat_history: body.history,
        });

      } catch (err) {
        // Ignore error
        console.error(err);
      } finally {
        sendData("[DONE]");
        res.end();
      }

    }
})

module.exports = router;
