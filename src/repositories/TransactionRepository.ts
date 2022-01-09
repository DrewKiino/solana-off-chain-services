import * as Web3 from '@solana/web3.js'
import * as SqlService from '../services/SqlService';
import {Column, Repository} from 'typeorm';
import {ConfirmedSignatureInfo} from '@solana/web3.js';
import {TransactionEntity} from '../entities/TransactionEntity';
import {TokenAccountEntity} from '../entities/TokenAccountEntity';
import {AccountEntity} from '../entities/AccountEntity';
import {TransactionToAccountEntity} from '../entities/TransactionToAccountEntity';
import {UpsertResult} from '../constants/types';

export const upsert = async function(
  signatureInfo: ConfirmedSignatureInfo
): Promise<TransactionEntity> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  const cache = await findOneBySignature(signatureInfo.signature)
  if (cache) return cache
  const entity = new TransactionEntity()
  entity.signature = signatureInfo.signature
  entity.slot = signatureInfo.slot
  entity.blockTime = signatureInfo.blockTime
  entity.memo = signatureInfo.memo
  return await repository.save(entity)
}

export const findOneBySignature = async function(
  signature: string
): Promise<TransactionEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  const entity = await repository.findOne({ signature: signature })
  return Promise.resolve(entity)
}

export const listUnmarkedTransactionsWithNoTokenBalances = async function(
  limit: number
): Promise<TransactionEntity[]> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  /*
    select t.id, t.block_time from transactions t
    left join token_balances tb on t.id = tb.transaction_id
    where isnull(tb.transaction_id) order by block_time desc;
   */
  return await repository.createQueryBuilder('t')
    .leftJoin(TokenAccountEntity, 'tb', 't.id = tb.transaction_id')
    .where('isNull(tb.transaction_id)')
    .orderBy('t.block_time', 'DESC')
    .limit(limit)
    .getMany()
}
