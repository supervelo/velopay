import React from "react";
import PromptComponent from "./components/Prompt/Prompt";
import { init } from '@airstack/airstack-react';
import { SolanaWalletProvider } from "./context/solana";

// import {
//   RainbowKitProvider,
//   connectorsForWallets,
// } from "@rainbow-me/rainbowkit";

// import { polygonMumbai } from "@wagmi/chains";
// import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
// import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { BananaWallet } from "@rize-labs/banana-rainbowkit-plugin";
import './App.css'

init(process.env.REACT_APP_AIRSTACK_KEY);

function App() {

  return (
    <div className="App">
      {/* <WagmiConfig client={wagmiClient}> */}
        <SolanaWalletProvider>
          <PromptComponent />
        </SolanaWalletProvider>
      {/* </WagmiConfig> */}
    </div>
  );
}

export default App;
