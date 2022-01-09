import {Market} from "@project-serum/serum";
import * as Web3 from "@solana/web3.js";
import {SERUM_DEX_PROGRAM_ID} from "../constants/ids";

const marketByMarketAddress: Record<string, Market | undefined> = {}

export const findByMarketAddress = async (
  connection: Web3.Connection,
  marketAddress: string
) => {
  const cache = marketByMarketAddress[marketAddress]
  if (cache) return cache
  const marketAddressPubKey  = new Web3.PublicKey(marketAddress)
  const market = await Market.load(connection, marketAddressPubKey, undefined, SERUM_DEX_PROGRAM_ID, null)
  marketByMarketAddress[marketAddress] = market
  return market
}
