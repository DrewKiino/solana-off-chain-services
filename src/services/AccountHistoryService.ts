import * as Web3 from '@solana/web3.js'
import {ParsedConfirmedTransaction, TransactionSignature} from '@solana/web3.js';

export async function fetchAccountHistory(
  connection: Web3.Connection,
  pubkey: Web3.PublicKey,
  options: {
    limit: number;
    before?: TransactionSignature
  }
): Promise<Record<string, ParsedConfirmedTransaction> | undefined> {
  try {
    const fetched = await connection.getConfirmedSignaturesForAddress2(
      pubkey,
      options
    )
    const history = {
      fetched,
      foundOldest: fetched.length < options.limit,
    }
    const signatures = history.fetched
      .map((signature) => signature.signature)
    return await fetchParsedTransactions(
      connection,
      signatures
    )
  } catch (error) {
    console.log(error)
  }
  return Promise.resolve(undefined)
}

const MAX_TRANSACTION_BATCH_SIZE = 10;

async function fetchParsedTransactions(
  connection: Web3.Connection,
  transactionSignatures: string[]
): Promise<Record<string, ParsedConfirmedTransaction>> {
  const transactionMap: Record<string, ParsedConfirmedTransaction> = {}

  while (transactionSignatures.length > 0) {
    const signatures = transactionSignatures.splice(
      0,
      MAX_TRANSACTION_BATCH_SIZE
    );
    const fetched = await connection.getParsedConfirmedTransactions(signatures);
    fetched.forEach(
      (parsed: Web3.ParsedConfirmedTransaction | null, index: number) => {
        if (parsed !== null) {
          transactionMap[signatures[index]] = parsed
        }
      }
    );
  }

  return transactionMap;
}