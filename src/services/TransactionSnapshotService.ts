import * as Web3 from '@solana/web3.js';
import {ConfirmedSignatureInfo} from '@solana/web3.js';
import {PreTokenBalance, TokenBalance} from '../constants/types';
import {TokenAccount, TokenAccountInfo} from '../validators/token';
import {create} from 'superstruct';
import {ParsedInfo} from '../validators';
import * as AccountRepository from '../repositories/AccountRepository'
import * as Cron from 'node-cron';
import {ScheduledTask} from 'node-cron';
import * as TransactionRepository from '../repositories/TransactionRepository';
import * as TransactionToAccountRepository from '../repositories/TransactionToAccountRepository';
import {TransactionEntity} from '../entities/TransactionEntity';
import {makeLoggerId} from '../util/util';
import {AccountEntity} from '../entities/AccountEntity';
import {TransactionToAccountEntity} from '../entities/TransactionToAccountEntity';
import {newTransactionQueue} from './QueueService';

export async function performEntireTransactionSignaturesScrape(
  connection: Web3.Connection,
  publicKey: Web3.PublicKey
) {
  const loggerId = makeLoggerId()
  /// First save address into Accounts
  const account = await AccountRepository.upsert({ address: publicKey.toBase58() })
  /// Then fetch the genesis Transaction
  const results = await connection.getConfirmedSignaturesForAddress2(
    publicKey,
    { limit: 1 }
  )
  if (results.length == 0) {
    return console.log(`${loggerId}: there are no transactions for this account ${publicKey.toBase58()}`)
  }
  const genesisTransaction = results[0]
  console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- begin scraping with genesis TRANSACTION ${genesisTransaction.signature}`)
  const limit = 1000
  performTransactionSignaturesFrontFill(connection, account, genesisTransaction, 5, limit)
  // performTransactionSignaturesBackFill(connection, account, genesisTransaction, 5, limit)
}

export function performTransactionSignaturesFrontFill(
  connection: Web3.Connection,
  lookUpAccount: AccountEntity,
  genesisTransaction: ConfirmedSignatureInfo,
  interval: number,
  limit: number
) {
  const publicKey = new Web3.PublicKey(lookUpAccount.address)
  const loggerId = makeLoggerId()
  const cronExpression = `*/${interval} * * * * *`
  let isTaskInProgress = false
  const cron: ScheduledTask = Cron.schedule(cronExpression, async () => {
    if (isTaskInProgress) return
    isTaskInProgress = true
    const latest = await TransactionToAccountRepository.findLatestByAddress(
      lookUpAccount.address
    )
    const untilSignature = latest?.signature || genesisTransaction.signature
    console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${limit}(N) <== ${untilSignature}`)
    const signatures = await connection.getConfirmedSignaturesForAddress2(
      publicKey,
      {
        limit: limit,
        until: untilSignature
      }
    )
    const earliest = await processSignatures(
      loggerId,
      publicKey,
      lookUpAccount,
      genesisTransaction,
      signatures,
      false
    )
    if (!earliest) {
      isTaskInProgress = false
      return console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- no more recent transactions`)
    }
    console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${earliest?.signature || 'NULL'} <== ${latest?.signature || 'NULL'}`)
    isTaskInProgress = false
  })
}

  export function performTransactionSignaturesBackFill(
    connection: Web3.Connection,
    lookUpAccount: AccountEntity,
    genesisTransaction: ConfirmedSignatureInfo,
    interval: number,
    limit: number
) {
  const publicKey = new Web3.PublicKey(lookUpAccount.address)
  const loggerId = makeLoggerId()
  const cronExpression = `*/${interval} * * * * *`
  let isTaskInProgress = false
  let cron: ScheduledTask
  cron = Cron.schedule(cronExpression, async () => {
    if (isTaskInProgress) return
    isTaskInProgress = true
    const earliest = await TransactionToAccountRepository.findEarliestByAddress(
      lookUpAccount.address
    )
    const untilSignature = earliest?.signature || genesisTransaction.signature
    console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${untilSignature} ==> ${limit}(N)`)
    const signatures = await connection.getConfirmedSignaturesForAddress2(
      publicKey,
      {
        limit: limit,
        before: untilSignature
      }
    )
    const latest = await processSignatures(
      loggerId,
      publicKey,
      lookUpAccount,
      genesisTransaction,
      signatures,
      true
    )
    if (!latest) {
      isTaskInProgress = false
      /// We've reached the end of the transaction history
      /// we can stop now =)
      cron.stop()
      return console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- no more later transactions`)
    }
    console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${earliest?.signature || 'NULL'} ==> ${latest?.signature || 'NULL'}`)
    isTaskInProgress = false
  })
}

async function processSignatures(
  loggerId: number,
  publicKey: Web3.PublicKey,
  lookUpAccount: AccountEntity,
  genesisTransaction: ConfirmedSignatureInfo,
  signatures: ConfirmedSignatureInfo[],
  isBackFill: boolean
): Promise<TransactionEntity | undefined> {
  if (signatures.length == 0) {
    console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- no more ${isBackFill ? 'later' : 'recent'} signatures found`)
    return undefined
  }
  console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${signatures.length} signatures found`)
  const cachedPromises = signatures.map((signature) => {
    return TransactionToAccountRepository.findOneTransactionByTransactionSignatureAndAccountId(
      signature.signature,
      lookUpAccount.id
    )
  })
  const cachedResults: (TransactionEntity | undefined)[] = await Promise.all(cachedPromises)
  let cachedSignatures = new Set<string>()
  for (const result of cachedResults) {
    if (!result) continue
    cachedSignatures.add(result.signature)
  }
  console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${cachedSignatures.size} signatures cached`)
  let transactionPromises: Promise<TransactionEntity>[] = []
  for (const signature of signatures) {
    if (cachedSignatures.has(signature.signature)) continue
    transactionPromises.push(TransactionRepository.upsert(signature))
  }
  if (transactionPromises.length == 0) return undefined
  const results: TransactionEntity[] = await Promise.all(transactionPromises)
  if (results.length == 0) return undefined
  let transactionToAccountPromises: Promise<TransactionToAccountEntity>[] = []
  let transactionToProcessPromises: Promise<void>[] = []
  for (const result of results) {
    transactionToAccountPromises.push(TransactionToAccountRepository.upsert(
      lookUpAccount.id,
      result.id
    ))
    transactionToProcessPromises.push(processNewTransaction(result))
  }
  const transactionToAccountResults: TransactionToAccountEntity[] = await Promise.all(transactionToAccountPromises)
  await Promise.all(transactionToProcessPromises)
  console.log(`${loggerId}: ADDRESS ${publicKey.toBase58()} -- ${transactionPromises.length} signatures new`)
  if (transactionToAccountResults.length == 0) return undefined
  if (isBackFill) return results.pop()
  return results[0]
}

export async function processNewTransaction(
  transaction: TransactionEntity
): Promise<void> {
  /// Send this transaction to a queue to be processed
  const job = newTransactionQueue.createJob(transaction)
  await job.save()
}

function performCronJob(
  callback: () => Promise<void>
) {
  const interval = 3
  const limit = 1000
  const loggerId = Math.floor(Math.random() * 100000)
  const cronExpression = `*/${interval} * * * * *`
  let isTaskInProgress = false
  let cron: ScheduledTask
  cron = Cron.schedule(cronExpression, async () => {
    if (isTaskInProgress) return
    isTaskInProgress = true
    await callback()
    isTaskInProgress = false
  })
}

function createParsedAccountInfo(
  parsedData: Web3.ParsedAccountData
): TokenAccountInfo {
  try {
    const data = create(parsedData.parsed, ParsedInfo);
    const parsed = create(data, TokenAccount);
    return create(parsed.info, TokenAccountInfo);
  } catch (error) {
    throw error;
  }
}
