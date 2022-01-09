import Web3 from '@solana/web3.js';
import {AccountEntity} from '../entities/AccountEntity';

export interface UpsertResult<Result> {
  upsert: boolean
  result: Result
}

export interface Account {
  address: string
}

export interface NewTokenSnapshot {
  tokenAccountId: number,
  decimals: number,
  price: number,
  supply: number,
  marketCap: number
}

export interface PreTokenBalance {
  account: Web3.PublicKey
  mint: string,
  preBalance: number
}

export interface TokenBalance {
  tokenAccountAddress: string
  tokenMintAccountAddress: string
  tokenOwnerAccountAddress: string
  preBalance: number
  postBalance: number
  changeBalance: number
  blockTime: number
  isNew: boolean
}

export interface Account {
  address: string
}

export interface TokenAccount {
  tokenAccount: AccountEntity
  tokenMintAccount: AccountEntity
  tokenOwnerAccount: AccountEntity
  balance: number
}

interface TokenSnapshot {
  id: number
  tokenAccount: Account
  decimals: number
  price: number
  supply: number
  marketCap: number
  createdAt: Date
  updatedAt: Date
}
