import * as DotEnv from 'dotenv';
import * as Cron from 'node-cron'
import {ScheduledTask} from 'node-cron'
import * as Web3 from '@solana/web3.js';
import {AccountInfo, ParsedAccountData, PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import * as CronTaskService from './services/CronTaskService'
import {TOKEN_PROGRAM_ID, toPublicKey} from './constants/ids';
import * as TokenSnapshotService from "./services/TokenSnapshotService";
import * as TokenBalanceSnapshotService from "./services/TokenAccountSnapshotService";
import * as TransactionSnapshotService from "./services/TransactionSnapshotService";
import * as TokenAccountRepository from "./repositories/TokenAccountRepository"
import * as TokenInfoRepository from "./repositories/TokenInfoRepository"
import * as AccountRepository from "./repositories/AccountRepository"
import {SOLANA_CONNECTION} from "./services/SolanaWeb3Service";
import {delay, makeLoggerId} from './util/util';
import {TransactionEntity} from './entities/TransactionEntity';
import {newTransactionQueue} from './services/QueueService';
import {TokenBalance} from './constants/types';
import {TokenAccountEntity} from './entities/TokenAccountEntity';
import {Strategy, TokenInfo, TokenListProvider} from '@solana/spl-token-registry';
import {fetchAccountInfo} from './services/AccountInfoService';
import {Buffer} from 'buffer';
import {AccountEntity} from './entities/AccountEntity';
import { TokenAccount } from './validators/token';

DotEnv.config();

(async () => {
  await testSolana2()
})()

async function startCronJobs() {
  const cronExpression = '*/3 * * * * *'
  const taskIdentifier = 'account_watch'
  // const cronTask = await CronTaskService.upsert(cronExpression, taskIdentifier)
  const cron: ScheduledTask = Cron.schedule(cronExpression, () => {
    (async () => {
      const allBridgeTokenAddress = 'a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp'
      const allBridgeMarketAddress = 'FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8'
      const snapshot = await TokenSnapshotService.takeSnapshot(
        SOLANA_CONNECTION,
        allBridgeTokenAddress,
        allBridgeMarketAddress
      )
    })()
  })
}

async function testCron() {
  const cronExpression = '*/3 * * * * *'
  const taskIdentifier = 'account_watch'
  const cronTask = await CronTaskService.upsert(cronExpression, taskIdentifier)
  const cron: ScheduledTask = Cron.schedule(cronExpression, () => {
    console.log('running a task every 3 seconds')
  })
}

async function testSolana0() {
  const connection = new Web3.Connection(
    process.env.SOLANA_RPC || "",
    // Web3.clusterApiUrl("devnet"),
    'confirmed',
  )
  // const ABR_MINT_ID: Web3.PublicKey = toPublicKey("a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp")
  // const result = await TransactionRepository.listUnmarkedTransactionsWithNoTokenBalances(3)
  // console.log(result)
  const ABR_SRM_DEX: Web3.PublicKey = toPublicKey('FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8')
  const TEST_MINT_ID: Web3.PublicKey = toPublicKey('orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE')
  // const TEST_MINT_ID: Web3.PublicKey = toPublicKey("TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs")
  // const TEST_MINT_ID: Web3.PublicKey = toPublicKey("a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp")

  const tokenListProvider = new TokenListProvider()
  const tokenList = await tokenListProvider.resolve(Strategy.CDN)
  const tokenInfos = tokenList.filterByChainId(101).getList()
  const tokenInfoByAddress: Record<string, TokenInfo> = {}
  for (const tokenInfo of tokenInfos) {
    tokenInfoByAddress[tokenInfo.address] = tokenInfo
  }

  const largestTokenAccounts = await connection.getTokenLargestAccounts(
    TEST_MINT_ID
  )

  const tokenAccountsByOwnerAddress: Record<string, RpcResponseAndContext<Array<{ pubkey: PublicKey; account: AccountInfo<Buffer>; }>>> = {}
  const tokenAmountByMintAddress: Record<string, number> = {}

  for (const largestTokenAccount of largestTokenAccounts.value) {
    const largestTokenAccountInfo = await connection.getParsedAccountInfo(largestTokenAccount.address)
    await delay(1000)
    const largestTokenAccountInfoData = largestTokenAccountInfo.value?.data as ParsedAccountData
    if (!largestTokenAccountInfoData) continue
    const tokenAccountOwnerPubKey = new Web3.PublicKey(largestTokenAccountInfoData.parsed.info.owner)
    const tokenAccountsPromiseTimeout = new Promise((res) => setTimeout(() => res(undefined), 5000))
    const tokenAccountsPromise = connection
      .getParsedTokenAccountsByOwner(tokenAccountOwnerPubKey, {programId: TOKEN_PROGRAM_ID})
    const results: any | undefined = await Promise.race([tokenAccountsPromise, tokenAccountsPromiseTimeout]);
    const tokenAccounts = results?.value
    if (!tokenAccounts) continue
    /// Skip market makers
    if (tokenAccounts.length > 100) continue
    for (const tokenAccount of tokenAccounts) {
      const tokenAccountPubKey = tokenAccount.pubkey
      const parsedInfo = tokenAccount.account.data.parsed.info
      const tokenMintPubKey = new Web3.PublicKey(parsedInfo.mint)
      const tokenInfo = tokenInfoByAddress[tokenMintPubKey.toBase58()]
      if (!tokenInfo) continue
      await delay(500)
      const tokenMintResult = await fetchAccountInfo(connection, tokenMintPubKey)
      if (!tokenMintResult) continue
      const parsedTokenMintInfo = tokenMintResult.details.data.parsed.info
      const tokenSupply = parsedTokenMintInfo.supply / Math.pow(10, parsedTokenMintInfo.decimals)
      const tokenAccountAmount = parsedInfo.tokenAmount.uiAmount
      const tokenAccountAmountDistribution = tokenAccountAmount / tokenSupply
      if (
        /// Filter out token accounts with amounts greater than 1%
        /// Because those are market maker wallets
        tokenAccountAmountDistribution > 0.01 ||
        /// Filter out obscure tokens
        !tokenInfo
      ) continue
      const key = tokenInfo.name
      const previousTokenAmount = tokenAmountByMintAddress[key] || 0.0
      const totalTokenAmount = previousTokenAmount + tokenAccountAmount
      tokenAmountByMintAddress[key] = totalTokenAmount
      const tokenAccountEntity = await AccountRepository.upsert({ address: tokenAccountPubKey.toBase58() })
      const tokenMintAccountEntity = await AccountRepository.upsert({ address: tokenMintPubKey.toBase58() })
      const tokenOwnerAccountEntity = await AccountRepository.upsert({ address: tokenAccountOwnerPubKey.toBase58() })
      const tokenInfoEntity = await TokenInfoRepository.upsert(
        tokenMintAccountEntity.address,
        tokenInfo.symbol,
        tokenInfo.decimals,
        tokenInfo.logoURI,
        tokenInfo.extensions?.website,
        tokenInfo.extensions?.coingeckoId
      )
      const result = await TokenAccountRepository.upsert({
        tokenAccount: tokenAccountEntity,
        tokenMintAccount: tokenMintAccountEntity,
        tokenOwnerAccount: tokenOwnerAccountEntity,
        balance: tokenAccountAmount
      })
    }
    // select a.address, ta.token_mint_account_id, sum(ta.balance) total from token_accounts ta inner join accounts a on a.id = ta.token_mint_account_id inner join token_infos ti on ti.token_mint_account_id = ta.token_mint_account_id group by ta.token_mint_account_id order by total
  }
}

async function testSolana2() {
  // Connect to cluster
  const connection = new Web3.Connection(
    process.env.SOLANA_RPC || "",
    // Web3.clusterApiUrl("devnet"),
    'confirmed',
  )
  const TEST_ADDRESS: Web3.PublicKey = toPublicKey("cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ")
  // const TEST_ADDRESS: Web3.PublicKey = toPublicKey("MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8")

  let tokenBalanceByTokenAddress: Record<string, TokenBalance> = {}

  // Process jobs from as many servers or processes as you like
  const concurrency = 1
  const processIntervalSeconds = 3
  const counts = await newTransactionQueue.checkHealth();
  // print all the job counts
  console.log('job state counts:', counts);

  await newTransactionQueue.destroy()

  newTransactionQueue.process(
    concurrency,
    async (job: { id: any; data: TransactionEntity })=> {
      const transaction = job.data
      return await processTransactionForTokenAccounts(connection, transaction)
    }
  )

  await TransactionSnapshotService.performEntireTransactionSignaturesScrape(
    connection,
    TEST_ADDRESS
  )
}

async function processTransactionForTokenAccounts(
  connection: Web3.Connection,
  transaction: TransactionEntity
): Promise<void> {
  const loggerId = makeLoggerId()
  const tokenAccounts = await TokenBalanceSnapshotService.getTokenAccountSnapshots(
    connection,
    transaction
  )
  const promises = tokenAccounts.map((tokenAccount) => {
    return TokenAccountRepository.upsert(tokenAccount)
  })
  const results: TokenAccountEntity[] = await Promise.all(promises)
  if (results.length == 0) return Promise.resolve()
  console.log(`${loggerId}: TRANSACTION ${transaction.signature} -- updated ${results.length} token balances`)
  for (const tokenAccount of tokenAccounts) {
    const info = await connection.getParsedAccountInfo(toPublicKey(tokenAccount.tokenMintAccount.address))
    const data: any = info.value?.data
    if (!data) break
    // const mintAuthority = data.parsed.info.mintAuthority
    console.log(data.parsed.info)
    // const mintAuthority = data.parsed.info.freezeAuthoriy
    // console.log(`TRANSACTION ${transaction.signature} -- mintToken ${tokenAccount.tokenMintAccount.address}`)
    // console.log(`TRANSACTION ${transaction.signature} -- mintAuthority ${mintAuthority}`)
    // console.log(`TRANSACTION ${transaction.signature} -- freezeAuthority ${freezeAuthoriy}`)
    // if (freezeAuthoriy == 'HBERHSe9s4GApnkLkWGpej8SGjs9DuL5pi3cpQwXXop4') {
    //   console.log("FOUND QT!!")
    // }
    break
  }
  return Promise.resolve()
}

async function testSolana() {
  // Connect to cluster
  const connection = new Web3.Connection(
    process.env.SOLANA_RPC || "",
    // Web3.clusterApiUrl("devnet"),
    'confirmed',
  )

  const ABE_RAY_AMM: Web3.PublicKey = toPublicKey('GQJjrG6f8HbxkE3ZVSRpzoyWhQ2RiivT68BybVK9DxME')
  const ABR_SRM_DEX: Web3.PublicKey = toPublicKey('FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8')
  const ABR_MINT_ID: Web3.PublicKey = toPublicKey("a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp")
  const TULIP_MINT_ID: Web3.PublicKey = toPublicKey("TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs")
  const SRM_PROGRAM_ID: Web3.PublicKey = toPublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")

  const url = 'http://192.168.1.88:8899'
  const wsURL = 'ws://192.168.1.88:8900'

  let isTaskInProgress = false
  const ABR_MINT_ADDRESS = ABR_MINT_ID.toBase58()

  const cron: ScheduledTask = Cron.schedule('*/3 * * * * *', async () => {
    const loggerId = makeLoggerId()
    if (isTaskInProgress) return
    isTaskInProgress = true
    const result = await TokenSnapshotService.takeSnapshot(
      connection,
      ABR_MINT_ADDRESS,
      ABR_SRM_DEX.toBase58()
    )
    console.log(result)
    isTaskInProgress = false
  })
}

export function displayTimestamp(
  unixTimestamp: number,
  shortTimeZoneName = false
): string {
  const expireDate = new Date(unixTimestamp);
  const dateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(expireDate);
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
    timeZoneName: shortTimeZoneName ? "short" : "long",
  }).format(expireDate);
  return `${dateString} at ${timeString}`;
}

export function displayTimestampUtc(
  unixTimestamp: number,
  shortTimeZoneName = false
): string {
  const expireDate = new Date(unixTimestamp);
  const dateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(expireDate);
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
    timeZone: "UTC",
    timeZoneName: shortTimeZoneName ? "short" : "long",
  }).format(expireDate);
  return `${dateString} at ${timeString}`;
}

export function displayTimestampWithoutDate(
  unixTimestamp: number,
  shortTimeZoneName = true
) {
  const expireDate = new Date(unixTimestamp);
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
    timeZoneName: shortTimeZoneName ? "short" : "long",
  }).format(expireDate);
  return timeString;
}
