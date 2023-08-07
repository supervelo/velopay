# VeloPAY

VeloPay is a cross-chain payment system that operates based on your "chat". Essentially, you input text, and we employ sophisticated methods (classifiers/LLM) to generate common transactions according to your intentions, such as swapping, buying/selling, transferring, and more.

We are currently in the process of integrating with Cross-chain NativeSwap and DeFi Txs on Solana. Specific-chain ChatGPT integration is considered also.

## Steps

1. cd client/
2. fill .env variables
3. npm install --legacy-peer-deps
4. npm run start
5. Run relayer & handler
6. Enter sample prompt: "Can you please send 15 USDC token to this address 0xeD37FD0d6F0f69236E7472B36796e133D20EcC32"
7. You should login to wallet with Passkeys to send txs

Required*: Node version > 18 with npm i --legacy-peer-deps