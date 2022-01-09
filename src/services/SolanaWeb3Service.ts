import * as Web3 from "@solana/web3.js";

export const SOLANA_CONNECTION = new Web3.Connection(
  process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com",
  'confirmed',
)

