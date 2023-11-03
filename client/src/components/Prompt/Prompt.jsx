import React, { useEffect, useState, useRef, useMemo } from "react";
import "./Prompt.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import Axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../shared/Loader/Loader";
import ModalComponent from "../shared/Modal/Modal";
import { Button, Dropdown, Space } from "antd";
// import StakingArtifact from "../abi/Staking.json";
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { FaRegCopy } from "react-icons/fa";
import {
  VersionedTransaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createSyncNativeInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { saveToLocalStorage } from "../../utils/saveToLocalstorage";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getTimeStep } from "../../utils/stream";
import styles from './Prompt.css'
import { Spin } from 'antd';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Markdown from './Markdown.jsx';
import Fab from "../FAB";
import { AnchorProvider } from "@coral-xyz/anchor";
import { ClockworkProvider } from "@clockwork-xyz/sdk";

const {
  StreamflowSolana,
  Types,
  GenericStreamClient,
  getBN,
  getNumberFromBN,
} = require("@streamflow/stream");
const { BN } = require("bn.js");

const getTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState({
    messages: [{
      "message": 
      `Hello there! I'm Velopay 🚴‍♂️ - your web3 interpreter friend. \n 
      - I can assist you in constructing Solana monetary automation with the most optimized ways. \n
      - Feel free to ask me to do any transactions I'll try my best to understand. \n
      * Extraneous feature: I can help you find answers about Clockwork SDK. I am in my learning journey to help you create programmable money smart contract.`,
      "type": "apiMessage"
    }],
    history: []
  });
  const { messages, pending, history } = messageState;

  const messageListRef = useRef();
  const textAreaRef = useRef();

  const {
    publicKey,
    signTransaction,
    connected,
  } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [intent, setIntent] = useState("");
  const [confirmModa, setConfirmModal] = useState(false);
  const [confirmThirdOption, setConfirmThirdOption] = useState("");
  const [txnType, setTxnType] = useState("");
  const [txnContext, setTxnContext] = useState("");

  const networkItems = [
    {
      key: "mainnet",
      label: (
        <h4 onClick={() => {}}> Mainnet-beta </h4>
      ),
    },
    {
      key: "devnet",
      label: (
        <h4 onClick={() => {}}>
          Devnet
        </h4>
      ),
    },
  ]

  const instructions = [
    { 
      label: "Automatically liquid-stake idle SOL weekly", 
      icon: <h4>Stake</h4>, 
      onClick: e => {
        e.preventDefault()
        setUserInput("Can you please stake 0.1 SOL into the staking platform with the highest APY with a weekly schedule?")
      }
    },
    { 
      label: "Swap", 
      icon: <h4>Swap</h4>, 
      onClick: (e) => {
        e.preventDefault()
        setUserInput("Help me exchange my 0.1 SOL for USDC tokens, optimizing for speed and security.")
      }
    },
    { 
      label: "NFT Buy Limit Order", 
      icon: <h4>NFT BLO</h4>, 
      onClick: e => {
        e.preventDefault()
        setUserInput("Can you purchase me 1 DegenPoet NFT?") 
      }
    },
    { 
      label: "Stream", 
      icon: <h4>Stream</h4>, 
      onClick: e => {
        e.preventDefault()
        setUserInput("I'm looking to make a 0.01 SOL token stream payment every second for 60 seconds to the recipient <SOLANA_ADDRESS>") 
      }
    },
    { 
      label: "DCA", 
      icon: <h4>DCA</h4>, 
      onClick: e => {
        e.preventDefault()
        setUserInput("Can you make a DCA for me with SOL token") 
      }
    }
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages.length]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const question = userInput.trim();
    if (question === "") {
      return;
    }

    setMessageState(state => ({
      ...state,
      messages: [...state.messages, {
        type: "userMessage",
        message: question
      }],
      pending: undefined
    }));

    setLoading(true);
    setUserInput("");
    setMessageState(state => ({ ...state, pending: "" }));

    const ctrl = new AbortController();

    fetchEventSource(SERVER_URL + '/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        question,
        history,
        userAddress: publicKey.toBase58()
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        console.log(event)
        if (event.data === "[DONE]") {
          setMessageState(state => ({
            history: [...state.history, [question, state.pending ?? ""]],
            messages: [...state.messages, {
              type: "apiMessage",
              message: state.pending ?? "",
            }],
            pending: undefined
          }));
          setLoading(false);

          ctrl.abort();
        } else {
          const msg = JSON.parse(event.data);
          const data = msg.data
          setMessageState(state => ({
            ...state,
            pending: (state.pending ?? "") + data,
          }));

          if (data.transaction) {
            setTransactions(data.transaction);
            setTxnContext(data.context);
        
            if (data.type) {
              setTxnType(data.type);
              if (data.type === "swap")
                setConfirmThirdOption("Place Limit Orders");
            
              setConfirmModal(true);
            } else {
              setTxnType("none");
            }
          }
        }
      }
    });
  }

  const closeModal = () => {
    setConfirmModal(false);
    setIsLoading(false);
  };


  const sendTransaction = async () => {
    setConfirmModal(false);
    // setIsLoading(false);
    // return;
    console.log("this is txn type ", txnType);
    const signer = publicKey;
    if (txnType === "staking") {
      const referralCode = new PublicKey("2QXSrPvhgky1aivBZjuN9oMV9mwzJRqKtQv9RpbFz1cf")
      const stakingMeta = transactions[0].data;
  
      const config = new MarinadeConfig({
        connection: connection,
        publicKey: publicKey,
        /* referralCode */
      })
      const marinade = new Marinade(config)
      
      const {
        associatedMSolTokenAccountAddress,
        transaction,
      } = await marinade.deposit(getBN(parseFloat(stakingMeta.amount), 9))

      // Prepare clockworkProvider
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

      // Prepare source
      const threadId = "spljs" + new Date().getTime();
      const [thread] = clockworkProvider.getThreadPDA(
        wallet.publicKey,  // thread authority
        threadId           // thread id
      );
      console.log(`Thread id: ${threadId}, address: ${thread}`);

      const ixs = transaction.instructions;

      // 2️⃣  Define a trigger condition for the thread. Every Sunday on 8:05
      const trigger = {
        cron: {
          schedule: "5 8 * * 0",
          skippable: true,
        },
      };

      // 3️⃣  Create the thread.
      const ix = await clockworkProvider.threadCreate(
        wallet.publicKey,    // authority
        threadId,                     // id
        ixs,                          // instructions to execute
        trigger,                      // trigger condition
        0.025 * LAMPORTS_PER_SOL      // amount to fund the thread with for execution fees
      );
      const tx = new Transaction().add(ix);
      const sig = await clockworkProvider.anchorProvider.sendAndConfirm(tx);
      console.log(`Thread created: ${sig}`);

      toast.success("Transaction successfull !!");
    } else {
      let txnResp;
      console.log("transactions formed ", transactions);

      if (txnType === "transfer") {
        const transferTransactionBuf = Buffer.from(
          transactions[0].data,
          "base64"
        );
        var transaction = VersionedTransaction.deserialize(
          transferTransactionBuf
        );
        const signedTx = await signTransaction(transaction);
        const txid = await sendAndConfirmTransaction(connection, signedTx);
        console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`);
        toast.success("Transaction successfull");
      }
      if (txnType === "nft_buy") {
        // buffer type
        const transferTransactionBuf = Buffer.from(
          transactions[0].data,
          "base64"
        );
        // console.log(transferTransactionBuf);
        var transaction = VersionedTransaction.deserialize(
          transferTransactionBuf
        );
        const signedTx = await signTransaction(transaction);
        const txid = await sendAndConfirmTransaction(connection, signedTx);
        // const txid = await sendAndConfirmTransaction(connection, signedTx);
        console.log(
          `https://explorer.solana.com/tx/${txid}?cluster=mainnet-beta`
        );
        toast.success("Transaction successfull");
      }
      // swap only works on mainnet
      if (txnType === "swap") {
        // deserialize the transaction
        const swapTransactionBuf = Buffer.from(transactions[0], "base64");
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // sign the transaction
        const signedTx = await signTransaction(transaction);
        const txid = await sendAndConfirmTransaction(connection, signedTx);
        console.log(`https://solscan.io/tx/${txid}`);
        toast.success("Transaction successfull");
      }
      if (txnType === "stream") {
        let transactionInstructions = [];
        // TODO: change program id based on cluster
        const STREAM_FLOW_DEVNET_PROGRAM_ID =
          "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ";
        const streamMeta = transactions[0].data;

        const connection = new Connection(clusterApiUrl("devnet"), "finalized");
        let {
          name,
          recipent,
          tokenId,
          amount,
          streamType,
          unlockInterval,
          streamDuration,
        } = streamMeta;
        // create ATA if not exists
        let mintToken = new PublicKey(tokenId);
        let recipentAddr = new PublicKey(recipent);
        const associatedTokenTo = await getAssociatedTokenAddress(
          mintToken,
          recipentAddr
        );
        if (!(await connection.getAccountInfo(associatedTokenTo))) {
          transactionInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              associatedTokenTo,
              recipentAddr,
              mintToken
            )
          );
        }
        const associatedTokenFrom = await getAssociatedTokenAddress(
          mintToken,
          publicKey
        );
        if (!(await connection.getAccountInfo(associatedTokenFrom))) {
          console.log("push tx0");
          transactionInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              associatedTokenFrom,
              publicKey,
              mintToken
            )
          );
        }

        let transferIx = SystemProgram.transfer({
          fromPubkey: publicKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL * 1.05, //TODO: handle convert to wSOL better
          toPubkey: associatedTokenFrom,
        });
        let syncIx = createSyncNativeInstruction(associatedTokenFrom);
        transactionInstructions.push(transferIx, syncIx);
        // transactionInstructions.push(
        //   createTransferInstruction(
        //     associatedTokenFrom, // source
        //     associatedTokenTo, // dest
        //     publicKey,
        //     parseFloat(amount) * LAMPORTS_PER_SOL
        //   )
        // );
        const block = await connection.getLatestBlockhash();
        const transaction = new Transaction({
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
          feePayer: publicKey,
        }).add(...transactionInstructions);
        console.log("abc", transactionInstructions);
        let signedTransaction = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        await connection.confirmTransaction({
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
          signature,
        });
        // console.log(" abcde", signature);
        // recipentATA = await getAssociatedTokenAddress(mint, recipent);
        // senderATA = await getAssociatedTokenAddress(mint, wallet.publicKey);
        // // If not enough wSOL, proceed to convert
        // let tokenAmount = await connection.getTokenAccountBalance(
        //   senderATA.address
        // );
        // if (tokenAmount.uiAmount <= parseFloat(amount)) {
        //   // Auto convert SOL to wSOL
        //   tx = new Transaction().add(
        //     // trasnfer SOL
        //     SystemProgram.transfer({
        //       fromPubkey: wallet.publicKey,
        //       toPubkey: senderATA,
        //       lamports:
        //         (parseFloat(amount) - tokenAmount.uiAmount) * LAMPORTS_PER_SOL,
        //     }),
        //     // sync wrapped SOL balance
        //     createSyncNativeInstruction(senderATA.address)
        //   );
        //   await sendAndConfirmTransaction(connection, tx, [wallet]);
        // }
        const solanaClient = new StreamflowSolana.SolanaStreamClient(
          clusterApiUrl("devnet"),
          undefined,
          undefined,
          STREAM_FLOW_DEVNET_PROGRAM_ID
        );
        const solanaParams = {
          sender: wallet, // SignerWalletAdapter or Keypair of Sender account
          // isNative: // [optional] [WILL CREATE A wSOL STREAM] Wether Stream or Vesting should be paid with Solana native token or not
        };
        let duration =
          getTimeStep(streamDuration[1]) * parseFloat(streamDuration[0]);
        let unlockingInterval = getTimeStep(unlockInterval);
        // console.log(unlockingInterval);
        // console.log(duration);
        // console.log(parseFloat(amount / duration) * LAMPORTS_PER_SOL);
        // Stream params
        let canTopup = streamType == "payment";
        const createStreamParams = {
          recipient: recipent, // Recipient address.
          tokenId: tokenId, // Token mint address.
          start: getTimestamp() + 120, // Timestamp (in seconds) when the stream/token vesting starts.
          amount: getBN(parseFloat(amount), 9), // depositing 100 tokens with 9 decimals mint.
          period: 1, // TODO: Handle other timestep
          cliff: getTimestamp() + 150, // Vesting contract "cliff" timestamp in seconds.
          cliffAmount: new BN(0), // Amount unlocked at the "cliff" timestamp.
          amountPerPeriod: getBN(parseFloat(amount / duration), 9), // Release rate: how many tokens are unlocked per each period.
          name: `Stream ${streamType}`, // The stream name or subject.
          canTopup: canTopup, // setting to FALSE will effectively create a vesting contract.
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
        toast.success("Transaction successfull");
      }
    }
  }

  const getPinataMetaData = (intent) =>
    JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "testing",
        keyvalues: {
          intent: intent,
        },
      },
      pinataContent: {
        intent: intent,
      },
    });

  const getPinataConfig = (intent) => ({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
    data: getPinataMetaData(intent),
  });

  const SERVER_URL = process.env.REACT_APP_HANDLER_API || "http://localhost:8080";

  const generateTransactions = async () => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    const pinataAxiosConfig = getPinataConfig(intent);
    console.log("this is pijnata axios config ", pinataAxiosConfig);
    // saving intents on ipfs for faster autocomplete
    const savingRes = await Axios(pinataAxiosConfig);
    console.log("resp", savingRes);
    // resp.data.IpfsHash
    saveToLocalStorage(publicKey, savingRes.data.IpfsHash);

    const res = await Axios.get(SERVER_URL + "/solve", {
      params: {
        intent: intent,
        userAddress: publicKey.toString(),
        chain: "devnet",
      },
      headers: { "Access-Control-Allow-Origin": "true" },
    });
    const transactions = JSON.parse(res.data.transactions);
    setTransactions(transactions.transaction);
    setTxnContext(transactions.context);

    if (transactions.type) {
      setTxnType(transactions.type);
    } else {
      setTxnType("none");
    }
    setConfirmModal(true);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [...messages, ...(pending ? [{ type: "apiMessage", message: pending }] : [])];
  }, [messages, pending]);

  return (
    <>
      <Toaster />
      <main className="main">
        <div className="rainbow-div">
          <div className="rainbow-btn">
            {connected ? (
              <div>
                {/* <TokenSection tokens={tokens.polygon} /> */}
                <p className="walletaddress-div">
                  {" "}
                  {publicKey.toString().slice(0, 5) +
                    "........." +
                    publicKey.toString().slice(-5)}
                </p>
                <WalletModalProvider>
                  <WalletDisconnectButton />
                </WalletModalProvider>
              </div>
            ) : (
              <div>
                  <WalletModalProvider>
                    <WalletMultiButton />
                  </WalletModalProvider> 
              </div>
            )}
          </div>
        </div>
        <ModalComponent
          transaction={transactions}
          intentContext={txnContext}
          footerThirdOption={confirmThirdOption}
          setConfirmThirdOption={setConfirmThirdOption}
          isModalOpen={confirmModa}
          closeModal={() => closeModal()}
          doTransaction={() => sendTransaction()}
        />
        <div className="cloud">
          <div ref={messageListRef} className={"messagelist"}>
            {chatMessages.map((message, index) => {
              let icon;
              let className;

              if (message.type === "apiMessage") {
                icon = () => <img src="/solana.jpeg" alt="AI" width="30" height="30" className="boticon"  style={{ borderRadius: '8px' }} />;
                className = "apimessage";
              } else {
                icon = () => <img src="/usericon.png" alt="Me" width="30" height="30" className="usericon"  style={{ borderRadius: '8px' }} />

                // The latest message sent by the user will be animated while waiting for a response
                className = loading && index === chatMessages.length - 1
                  ? "usermessagewaiting"
                  : "usermessage";
              }
              return (
                <div key={index} className={className}>
                  {icon}
                  <div className={"markdownanswer"}>
                    <Markdown markdown={message.message} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Fab actions={instructions} />
        <div className="center">
          <div className="cloudform">
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={loading ? "Waiting for response..." : "Type your question..."}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className={"textarea"}
              />
              <button
                type="submit"
                disabled={loading}
                className={"generatebutton"}
              >
                {loading ? (
                  <div className={"loadingwheel"}>
                    <Spin spinning={loading} />
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg viewBox='0 0 20 20' className={"svgicon"} xmlns='http://www.w3.org/2000/svg'>
                    <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
