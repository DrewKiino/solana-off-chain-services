import * as Web3 from '@solana/web3.js';
import {PreTokenBalance, TokenAccount, TokenBalance} from '../constants/types';
import {TransactionEntity} from '../entities/TransactionEntity';
import * as TransactionRepository from '../repositories/TransactionRepository'
import * as AccountRepository from '../repositories/AccountRepository'
import {delay} from '../util/util';
import {AccountInfo, ParsedAccountData, RpcResponseAndContext} from '@solana/web3.js';
import {Buffer} from 'buffer';
import {AccountEntity} from '../entities/AccountEntity';
import {randomInt} from 'crypto';

export async function getTokenAccountSnapshots(
  connection: Web3.Connection,
  transaction: TransactionEntity
): Promise<TokenAccount[]> {
  try {
    const result = await connection.getParsedConfirmedTransaction(transaction.signature)
    if (!result) return []
    return await parseTokenAccounts(
      connection,
      transaction,
      result
    )
  } catch (error) {
    console.log(error)
    return []
  }
}

async function parseTokenAccounts(
  connection: Web3.Connection,
  transaction: TransactionEntity,
  parsedConfirmedTransaction: Web3.ParsedConfirmedTransaction
): Promise<TokenAccount[]> {
  const accountKeys = parsedConfirmedTransaction.transaction.message.accountKeys
  const meta = parsedConfirmedTransaction.meta
  const tokenAccountByPubKey: Record<string, TokenAccount> = {}
  if (!meta) return []
  const postTokenBalances = meta.postTokenBalances
  if (!postTokenBalances) return []
  let accountKeyPromises: Promise<AccountEntity>[] = []
  let addresses = new Set<string>()
  accountKeys.forEach((accountKey) => addresses.add(accountKey.pubkey.toBase58()))
  postTokenBalances.forEach((postTokenBalance) => addresses.add(postTokenBalance.mint))
  addresses.forEach((address) => {
    return accountKeyPromises.push(AccountRepository.upsert({ address: address }))
  })
  const accountEntities: AccountEntity[] = await Promise.all(accountKeyPromises)
  let accountEntityByAddress: Record<string, AccountEntity> = {}
  for (const accountEntity of accountEntities) {
    accountEntityByAddress[accountEntity.address] = accountEntity
  }
  let promises: Promise<ParsedAccountDataWithAccountRef | undefined>[] = []
  for (const postTokenBalance of postTokenBalances) {
    const account = accountKeys[postTokenBalance.accountIndex].pubkey
    promises.push(getParsedAccountInfoWithAccountRef(connection, account))
  }
  const results = await Promise.all(promises)
  for (const result of results) {
    if (!result) continue
    const resultWithRef = result as ParsedAccountDataWithAccountRef
    const parsedInfo = resultWithRef.parsedAccountData.parsed?.info
    const accountAddress = resultWithRef.account.toBase58()
    if (!parsedInfo) continue
    const mintAddress = parsedInfo.mint
    const ownerAddress = parsedInfo.owner
    const tokenAccount = accountEntityByAddress[accountAddress]
    const tokenMintAccount = accountEntityByAddress[mintAddress]
    const tokenOwnerAccount = accountEntityByAddress[ownerAddress]
    const tokenAmount = parsedInfo.tokenAmount.uiAmount
    if (!tokenAccount) continue
    if (!tokenMintAccount) continue
    if (!tokenOwnerAccount) continue
    tokenAccountByPubKey[accountAddress] = {
      tokenAccount: tokenAccount,
      tokenMintAccount: tokenMintAccount,
      tokenOwnerAccount: tokenOwnerAccount,
      balance: tokenAmount
    }
  }
  return Object.values(tokenAccountByPubKey)
}

async function getParsedAccountInfoWithAccountRef(
  connection: Web3.Connection,
  account: Web3.PublicKey
): Promise<ParsedAccountDataWithAccountRef | undefined> {
  await delay(randomInt(1, 30) * 100)
  const result: RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null> = await connection.getParsedAccountInfo(account)
  const data = result.value?.data as ParsedAccountData
  if (!data) return undefined
  return {
    account: account,
    parsedAccountData: data
  }
}

interface ParsedAccountDataWithAccountRef {
  account: Web3.PublicKey
  parsedAccountData: ParsedAccountData
}
