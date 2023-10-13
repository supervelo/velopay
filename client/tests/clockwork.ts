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
    const source = ?
    const [sourceAta] = await fundSource(connection, payer, source);
    console.log(`source: ${source}, sourceAta: ${sourceAta}`);
  });
});
