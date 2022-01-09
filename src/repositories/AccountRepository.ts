import {Account, TokenBalance} from '../constants/types';
import * as SqlService from '../services/SqlService';
import {Repository} from 'typeorm';
import {AccountEntity} from '../entities/AccountEntity';

export const upsert = async function(
  account: Account
): Promise<AccountEntity> {
  const connection = await SqlService.connection()
  const repository: Repository<AccountEntity> = connection.getRepository(AccountEntity)
  const cache = await findOneByAddress(account.address)
  if (cache) return Promise.resolve(cache)
  const entity = new AccountEntity()
  entity.address = account.address
  await repository.save(entity)
  return entity
}

export const findOneByAddress = async function(
  address: string
): Promise<AccountEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<AccountEntity> = connection.getRepository(AccountEntity)
  return await repository.findOne({ address: address })
}

export const findOneById = async function(
  accountId: number
): Promise<AccountEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<AccountEntity> = connection.getRepository(AccountEntity)
  return await repository.findOne({ id: accountId })
}
