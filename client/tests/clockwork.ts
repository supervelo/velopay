import { expect } from "chai";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  mintTo,
} from "@solana/spl-token";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ClockworkProvider } from "@clockwork-xyz/sdk";
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'


describe("spl-transfer", async () => {
  it("It transfers tokens every 10s", async () => {
    const connection = new Connection("http://localhost:8899", "processed");
    const payer = Keypair.generate()

    // Prepare clockworkProvider
    const provider = new AnchorProvider(
      connection,
      new NodeWallet(payer),
      AnchorProvider.defaultOptions()
    );
    const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

    // Prepare dest
    const dest = Keypair.generate().publicKey;
    const destAta = (await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,        // the address of the mint
      dest,
      false        // is dest a pda?
    )).address;
    console.log(`dest: ${dest}, destAta: ${destAta}`);  

    // Prepare source
    const threadId = "spljs" + new Date().getTime();
    const [thread] = clockworkProvider.getThreadPDA(
      provider.wallet.publicKey,  // thread authority
      threadId                    // thread id
    );
    console.log(`Thread id: ${threadId}, address: ${thread}`);

    // We will use the thread pda as the source and fund it with some tokens
    const source = thread;
    const [sourceAta] = await fundSource(connection, payer, source);
    console.log(`source: ${source}, sourceAta: ${sourceAta}`);

    // 1️⃣ Build the SPL Transfer Instruction
    const targetIx = createTransferInstruction(sourceAta, destAta, source, amount);


    // 2️⃣  Define a trigger condition for the thread.
    const trigger = {
      cron: {
        schedule: "5 8 * * 0",
        skippable: true,
      },
    };

    // 3️⃣  Create the thread.
    const ix = await clockworkProvider.threadCreate(
      provider.wallet.publicKey,    // authority
      threadId,                     // id
      [targetIx],                   // instructions to execute
      trigger,                      // trigger condition
      LAMPORTS_PER_SOL              // amount to fund the thread with for execution fees
    );
    const tx = new Transaction().add(ix);
    const sig = await clockworkProvider.anchorProvider.sendAndConfirm(tx);
    console.log(`Thread created: ${sig}`);
  });

});
