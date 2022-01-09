import {TransactionEntity} from '../entities/TransactionEntity';
import * as SqlService from '../services/SqlService';
import {Repository} from 'typeorm';
import {TransactionToAccountEntity} from '../entities/TransactionToAccountEntity';
import {AccountEntity} from '../entities/AccountEntity';

export const upsert = async function(
  accountId: number,
  transactionId: number
): Promise<TransactionToAccountEntity> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionToAccountEntity> = connection.getRepository(TransactionToAccountEntity)
  const cache = await findOneByTransactionIdAndAccountId(
    accountId,
    transactionId
  )
  if (cache) return Promise.resolve(cache)
  const entity = new TransactionToAccountEntity()
  entity.account = { id: accountId } as AccountEntity
  entity.transaction = { id: transactionId } as TransactionEntity
  await repository.save(entity)
  return entity
}

export const findOneByTransactionIdAndAccountId = async function(
  accountId: number,
  transactionId: number
): Promise<TransactionToAccountEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionToAccountEntity> = connection.getRepository(TransactionToAccountEntity)
  return await repository
    .createQueryBuilder('toa')
    .where(`toa.account_id = ${accountId}`)
    .where(`toa.transaction_id = ${transactionId}`)
    .limit(1)
    .getOne()
}

export const findOneTransactionByTransactionSignatureAndAccountId = async function(
  transactionSignature: string,
  accountId: number,
): Promise<TransactionEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  return await repository
    .createQueryBuilder('t')
    .innerJoin(TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
    .innerJoin(AccountEntity, 'a', 'a.id = toa.account_id')
    .where(`toa.account_id = ${accountId}`)
    .where(`t.signature = '${transactionSignature}'`)
    .limit(1)
    .getOne()
}

export const listTransactionsByAddress = async function(
  address: string,
  limit: number,
  offset: number = 0
): Promise<TransactionEntity[]> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  return await repository.createQueryBuilder('t')
    .innerJoin(TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
    .innerJoin(AccountEntity, 'a', 'a.id = toa.account_id')
    .where(`a.address = '${address}'`)
    .orderBy('t.block_time', 'DESC')
    .limit(limit)
    .offset(offset)
    .getMany()
}

export const findLatestByAddress = async function(
  address: string
): Promise<TransactionEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  return await repository.createQueryBuilder('t')
    .innerJoin(TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
    .innerJoin(AccountEntity, 'a', 'a.id = toa.account_id')
    .where(`a.address = '${address}'`)
    .orderBy('t.block_time', 'DESC')
    .limit()
    .getOne()
}

export const findEarliestByAddress = async function(
  address: string
): Promise<TransactionEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  return await repository.createQueryBuilder('t')
    .innerJoin(TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
    .innerJoin(AccountEntity, 'a', 'a.id = toa.account_id')
    .where(`a.address = '${address}'`)
    .orderBy('t.block_time', 'ASC')
    .limit(1)
    .getOne()
}
