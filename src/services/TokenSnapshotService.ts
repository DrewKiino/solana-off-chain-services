import {Repository} from "typeorm";
import * as SqlService from './SqlService'
import {TokenSnapshotEntity} from "../entities/TokenSnapshotEntity";
import {NewTokenSnapshot} from "../constants/types";
import * as Web3 from "@solana/web3.js";
import {SERUM_DEX_PROGRAM_ID, toPublicKey} from "../constants/ids";
import {Market} from "@project-serum/serum";
import {fetchAccountInfo} from "./AccountInfoService";
import {findByMarketAddress} from "./SerumMarketService";
import {AccountEntity} from '../entities/AccountEntity';
import * as AccountRepository from '../repositories/AccountRepository';

export const takeSnapshot = async function(
  connection: Web3.Connection,
  tokenAddress: string,
  marketAddress: string
): Promise<TokenSnapshotEntity> {
  console.log(`taking snapshot tokenAddress: ${tokenAddress} marketAddress: ${marketAddress}`)

  const publicKey: Web3.PublicKey = toPublicKey(tokenAddress)

  const tokenAccount = await AccountRepository.upsert({ address: tokenAddress })

  const market = await findByMarketAddress(
    connection,
    marketAddress
  )

  // Fetching order books
  const bids = await market.loadBids(connection)
  const asks = await market.loadAsks(connection)

  const bid = bids.getL2(1)[0][0]
  const ask = asks.getL2(1)[0][0]
  const price = Math.floor((bid + ask) / 2 * 100) / 100

  const result: any = await fetchAccountInfo(
    connection,
    publicKey
  )

  const info = result.details.data.parsed.info
  const decimals = info.decimals
  const supply = info.supply / Math.pow(10, decimals)
  const marketCap = price * supply

  console.log(`publicKey: ${publicKey} price: ${price}, circulating_supply: ${supply}, market_cap: ${marketCap}`)

  const mostRecentSnapshot = await findMostRecentSnapshot()
  if (mostRecentSnapshot) {
    if (mostRecentSnapshot.price == price &&
      mostRecentSnapshot.supply == supply &&
      mostRecentSnapshot.marketCap == marketCap
    ) {
      console.log('skipping snapshot, no new data.')
      return mostRecentSnapshot
    }
  }

  const snapshot = await insert({
    tokenAccountId: tokenAccount.id,
    decimals: decimals,
    price: price,
    supply: supply,
    marketCap: marketCap
  })

  console.log(`created new snapshot ${snapshot.id}`)

  return Promise.resolve(snapshot)
}

export const insert = async function(
  newSnapshot: NewTokenSnapshot
): Promise<TokenSnapshotEntity> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenSnapshotEntity> = connection.getRepository(TokenSnapshotEntity)
  const snapshot = new TokenSnapshotEntity()
  snapshot.tokenAccount = { id: newSnapshot.tokenAccountId } as AccountEntity
  snapshot.decimals = newSnapshot.decimals
  snapshot.price = newSnapshot.price
  snapshot.supply = newSnapshot.supply
  snapshot.marketCap = newSnapshot.marketCap
  await repository.save(snapshot)
  return snapshot
}

export const findMostRecentSnapshot = async function(
): Promise<TokenSnapshotEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenSnapshotEntity> = connection.getRepository(TokenSnapshotEntity)
  return await repository.createQueryBuilder()
    .orderBy('created_at', 'DESC')
    .limit(1)
    .getOne()
}

export const listByAccountAddress = async function(
  address: string
): Promise<TokenSnapshotEntity[]> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenSnapshotEntity> = connection.getRepository(TokenSnapshotEntity)
  let now = new Date(); // today!
  const sevenDay = new Date(now.setDate(now.getDate() - 7)).toISOString()
  return repository.createQueryBuilder('ts')
    .innerJoin(AccountEntity, 'a', 'a.id = ts.token_account_id')
    .where(`ts.created_at >= '${sevenDay}'`)
    .limit(100)
    .orderBy('ts.created_at', 'DESC')
    .getMany()
}

export const list = async function(
): Promise<TokenSnapshotEntity[]> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenSnapshotEntity> = connection.getRepository(TokenSnapshotEntity)
  return await repository.find()
}
