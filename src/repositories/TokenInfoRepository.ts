import {TransactionToAccountEntity} from '../entities/TransactionToAccountEntity';
import * as SqlService from '../services/SqlService';
import {Repository} from 'typeorm';
import {AccountEntity} from '../entities/AccountEntity';
import {TransactionEntity} from '../entities/TransactionEntity';
import {TokenInfoEntity} from '../entities/TokenInfoEntity';
import {TokenAccountEntity} from '../entities/TokenAccountEntity';
import * as AccountRepository from './AccountRepository';

export const upsert = async function(
  mintAccountAddress: string,
  symbol: string,
  decimals: number,
  logoUri: string | undefined,
  website: string | undefined,
  coingeckoId: string | undefined
): Promise<TokenInfoEntity> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenInfoEntity> = connection.getRepository(TokenInfoEntity)
  const cache = await findOneByTokenMintAccountAddress(mintAccountAddress)
  if (cache) {
    if (logoUri) cache.logoUri = logoUri
    if (website) cache.website = website
    if (coingeckoId) cache.coingeckoId = coingeckoId
    return cache
  }
  const entity = new TokenInfoEntity()
  const tokenMintAccount = await AccountRepository.upsert({ address: mintAccountAddress })
  entity.tokenMintAccount = { id: tokenMintAccount.id } as AccountEntity
  entity.symbol = symbol
  entity.decimals = decimals
  entity.logoUri = logoUri
  entity.website = website
  entity.coingeckoId = coingeckoId
  await repository.save(entity)
  return entity
}

export const findOneByTokenMintAccountId = async function(
  mintAccountId: number
): Promise<TokenInfoEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenInfoEntity> = connection.getRepository(TokenInfoEntity)
  return await repository
    .createQueryBuilder('to')
    .where(`to.token_mint_account_id = ${mintAccountId}`)
    .limit(1)
    .getOne()
}

export const findOneByTokenMintAccountAddress = async function(
  mintAccountAddress: string
): Promise<TokenInfoEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenInfoEntity> = connection.getRepository(TokenInfoEntity)
  return await repository
    .createQueryBuilder('to')
    .innerJoin(AccountEntity, "a", "a.id = to.token_mint_account_id")
    .where(`a.address = '${mintAccountAddress}'`)
    .limit(1)
    .getOne()
}
