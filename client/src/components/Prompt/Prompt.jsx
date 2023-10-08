import React, { useEffect, useState, useRef } from "react";
import "./Prompt.css";
import { Banana, Chains } from "../../sdk/index";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import Axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../shared/Loader/Loader";
import ModalComponent from "../shared/Modal/Modal";
import { Button, Dropdown, Space } from "antd";
// import StakingArtifact from "../abi/Staking.json";
import { bundleAndSend } from "../../bundler/bundleAndSend";
import { createAttestation } from "../../attest/createAttestation";
import { useLazyQueryWithPagination } from "@airstack/airstack-react";
import { ERC20TokensQueryPolygon } from "../../query";
import TokenSection from "../tokens/Token";
import { FaRegCopy } from "react-icons/fa";
import {
  VersionedTransaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  PublicKey,
  Keypair,
  Connection,
} from "@solana/web3.js";
import bs58 from "bs58";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { saveToLocalStorage } from "../../utils/saveToLocalstorage";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
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
const PromptComponent = () => {
  const items = [
    {
      key: Chains.mumbai,
      label: (
        <h4 onClick={() => setCurrentChain(Chains.mumbai)}> Polygon Mumbai </h4>
      ),
    },
    {
      key: Chains.polygonMainnet,
      label: (
        <h4 onClick={() => setCurrentChain(Chains.polygonMainnet)}>
          Polygon Mainnet
        </h4>
      ),
    },
    {
      key: Chains.gnosis,
      label: <h4 onClick={() => setCurrentChain(Chains.gnosis)}>Gnosis</h4>,
    },
    {
      key: Chains.celoTestnet,
      label: (
        <h4 onClick={() => setCurrentChain(Chains.celoTestnet)}>
          Celo Testnet
        </h4>
      ),
    },
  ];

  const {
    publicKey,
    sendTransaction: sendSolanaTransaction,
    signTransaction,
    signMessage,
    connecting,
    connected,
    disconnecting,
  } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [walletAddress, setWalletAddress] = useState("");
  const [bananaSdkInstance, setBananSdkInstance] = useState(null);
  const [transactions, setTransactions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("Welcome to Banana Demo");
  const [intent, setIntent] = useState("");
  const [confirmModa, setConfirmModal] = useState(false);
  const [currentChain, setCurrentChain] = useState(Chains.mumbai);
  const [txnType, setTxnType] = useState("");
  const [txnContext, setTxnContext] = useState("");
  const [tokens, setTokens] = useState({
    polygon: [],
  });
  const [previosIntents, setPreviousIntents] = useState([]);
  const [onramp, setOnRamp] = useState(false);
  const [fetch, { data: data, loading, pagination }] =
    useLazyQueryWithPagination(ERC20TokensQueryPolygon);

  const gateway = (hash) =>
    `https://gray-roasted-macaw-763.mypinata.cloud/ipfs/${hash}`;
  const fetchIntents = async () => {
    let hashes = localStorage.getItem(publicKey);
    if (hashes) {
      hashes = JSON.parse(hashes);
      console.log(hashes, hashes[0]);
      for (let i = 0; i < hashes.length; i++) {
        const res = await Axios.get(gateway(hashes[i]));
        console.log(res);
        let pIntents = previosIntents;
        pIntents.push({
          id: i,
          name: res.data.intent,
        });
        setPreviousIntents(pIntents);
        console.log("all intens ", previosIntents);
      }
    }
  };

  useEffect(() => {
    // for now hardcoded the tokens
    if ("0x288d1d682311018736B820294D22Ed0DBE372188") {
      setTokens({
        polygon: [],
      });
      fetch({
        owner: "0x288d1d682311018736B820294D22Ed0DBE372188",
        limit: 20,
      });
    }

    fetchIntents();
    // initStripe()
  }, [fetch, publicKey]);

  useEffect(() => {
    if (data) {
      setTokens((existingTokens) => ({
        polygon: [
          ...existingTokens.polygon,
          ...(data?.polygon?.TokenBalance || []),
        ],
      }));

      console.log("this is data of polygon ", data);
    }
  }, [data]);

  useEffect(() => {
    getBananaInstance();
  }, []);

  useEffect(() => {
    getBananaInstance();
  }, [currentChain]);

  const SERVER_URL = process.env.REACT_APP_HANDLER_API || "http://localhost:81";

  const getBananaInstance = () => {
    const bananaInstance = new Banana(currentChain);
    setBananSdkInstance(bananaInstance);
  };

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
    if (txnType === "bridge") {
      await bundleAndSend(transactions);
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
      }
      if (txnType === "stream") {
        console.log("abc", process.env.TESTING_PRIVATE_KEY);
        let connection = new Connection(clusterApiUrl("devnet"), {
          commitment: "confirmed",
        });
        // Only works on devnet
        const solanaClient = new StreamflowSolana.SolanaStreamClient(
          clusterApiUrl("devnet"),
          undefined,
          undefined,
          "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ"
        );
        let mint = new PublicKey("So11111111111111111111111111111111111111112");
        let owner = new PublicKey(
          "4WMjxRZ1HhX4RhZ1fiohpwUTmjeCudQhwYogzvqHKSjh"
        );
        // create ATA if not exists
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
        const solanaParams = {
          sender: wallet, // SignerWalletAdapter or Keypair of Sender account
          // isNative: // [optional] [WILL CREATE A wSOL STREAM] Wether Stream or Vesting should be paid with Solana native token or not
        };
        // let createStreamParams = transactions[0].data;
        const streamMeta = transactions[0].data;
        const {
          name,
          recipent,
          tokenId,
          amount,
          streamType,
          unlockInterval,
          streamDuration,
        } = streamMeta;
        let canTopup = streamType == "payment";
        const createStreamParams = {
          recipient: recipent, // Recipient address.
          tokenId: tokenId, // Token mint address.
          start: getTimestamp() + 30, // Timestamp (in seconds) when the stream/token vesting starts.
          amount: getBN(parseFloat(amount), 9), // depositing 100 tokens with 9 decimals mint.
          period: 1, // Time step (period) in seconds per which the unlocking occurs.
          cliff: getTimestamp() + 30, // Vesting contract "cliff" timestamp in seconds.
          cliffAmount: new BN(0), // Amount unlocked at the "cliff" timestamp.
          amountPerPeriod: getBN(parseFloat(0.00001), 9), // Release rate: how many tokens are unlocked per each period.
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
        console.log("abcabc", createStreamParams);
        const { ixs, txId, metadataId } = await solanaClient.create(
          createStreamParams,
          solanaParams
        ); // second argument differ depending on a chain
        console.log(`${ixs}\n${txId}\n${metadataId}`);
      }

      // sendBatchTransaction handler?
    }

    toast.success("Transaction successfull !!");
    setIsLoading(false);
  };

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
        chain: currentChain,
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
  // goerli = 5,
  // mumbai = 80001,
  // polygonMainnet = 137,
  // optimismTestnet = 420,
  // gnosis = 100,
  // chiadoTestnet = 10200,
  // shibuyaTestnet = 81,
  // astar = 592,
  // fuji = 43113,
  // celoTestnet = 44787,
  // mantleTestnet = 5001,
  const getChainName = (chain) => {
    if (chain === 137) return "Polygon";
    if (chain === 100) return "Gnosis";
    if (chain === 5) return "Goerli";
    if (chain === 80001) return "Polygon Mumbai";
    if (chain === 420) return "Optimism Testnet";
    if (chain === 10200) return "Chiado Testnet";
    if (chain === 44787) return "Celo Testnet";
  };

  const itemss = [
    {
      id: 0,
      name: "Cobol",
    },
    {
      id: 1,
      name: "JavaScript",
    },
    {
      id: 2,
      name: "Basic",
    },
    {
      id: 3,
      name: "PHP",
    },
    {
      id: 4,
      name: "Java",
    },
  ];

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results);
    setIntent(string);
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: 'block', textAlign: 'left' }}>id: {item.id}</span> */}
        <span style={{ display: "block", textAlign: "left" }}>
          name: {item.name}
        </span>
      </>
    );
  };

  return (
    <div>
      <Loader isLoading={isLoading}>
        <Toaster />
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
                {/* <CopyToClipboard text={walletAddress} onCopy={() => toast.success('Address copied')}>
              <FaRegCopy style={{ marginLeft: "10px" }} />
                </CopyToClipboard> */}
                {/* <button className="connect-btn" onClick={() => setOnRamp(true)}>
                  Onramp funds
                </button> */}
              </div>
            ) : (
              <div>
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottom"
                  className="chain-dropdown"
                >
                  <Button>Devnet</Button>
                </Dropdown>
                <WalletModalProvider>
                  <WalletMultiButton />
                </WalletModalProvider>
                {/* <button className="connect-btn" onClick={() => connectWallet()}>
                  Connect
                </button> */}
              </div>
            )}
            {/* <OnrampComponent openOnramp={onramp} /> */}
          </div>
        </div>
        <div className="prompt">
          <div className="content">
            {/* <ReactSearchAutocomplete
            items={previosIntents}
            onSearch={handleOnSearch}
            // onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            onKeyDown={() => { console.log("key down") }}
            className="inputField"
            formatResult={formatResult}
          /> */}
            <input
              className="inputField"
              type="text"
              placeholder="Enter your intention"
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generateTransactions();
              }}
            />
            <button
              className="executeButton"
              onClick={() => {
                generateTransactions();
                // await createAttestation(walletAddress, intent);
              }}
            >
              Execute
            </button>

            <ModalComponent
              transaction={transactions}
              intentContext={txnContext}
              isModalOpen={confirmModa}
              closeModal={() => closeModal()}
              doTransaction={() => sendTransaction()}
            />
          </div>
        </div>
      </Loader>
    </div>
  );
};

export default PromptComponent;
