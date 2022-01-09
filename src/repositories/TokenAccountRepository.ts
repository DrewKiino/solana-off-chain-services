import Web3, {ConfirmedSignatureInfo} from '@solana/web3.js';
import {TransactionEntity} from '../entities/TransactionEntity';
import * as SqlService from '../services/SqlService';
import {Column, Repository} from 'typeorm';
import * as AccountRepository from './AccountRepository';
import {TokenAccount, TokenBalance} from '../constants/types';
import {TokenAccountEntity} from '../entities/TokenAccountEntity';
import {AccountEntity} from '../entities/AccountEntity';
import {makeLoggerId} from '../util/util';

/*
  HELPFUL SQL COMMANDS

  - SHOW ALL TOKEN ACCOUNT ADDRESSES WITH MORE THAN ONE BALANCE CHANGE
    select token_account_address, count(token_account_address) from token_balances
    group by token_account_address having count(token_account_address) > 1;
 */

export const upsert = async function(
  tokenAccount: TokenAccount
): Promise<TokenAccountEntity> {
  const loggerId = makeLoggerId()
  const connection = await SqlService.connection()
  const repository: Repository<TokenAccountEntity> = connection.getRepository(TokenAccountEntity)
  /// Check if token balance already exists
  const cache = await findOneByTokenAccountId(tokenAccount.tokenAccount.id)
  if (cache) {
    cache.balance = tokenAccount.balance
    console.log(`${loggerId}: TOKEN OWNER ${tokenAccount.tokenOwnerAccount.address} MINT ${tokenAccount.tokenMintAccount.address} BALANCE ${tokenAccount.balance}`)
    return await repository.save(cache)
  }
  const entity = new TokenAccountEntity()
  entity.tokenAccount = { id: tokenAccount.tokenAccount.id } as AccountEntity
  entity.tokenMintAccount = { id: tokenAccount.tokenMintAccount.id } as AccountEntity
  entity.tokenOwnerAccount = { id: tokenAccount.tokenOwnerAccount.id } as AccountEntity
  entity.balance = tokenAccount.balance
  console.log(`${loggerId}: TOKEN OWNER ${tokenAccount.tokenOwnerAccount.address} MINT ${tokenAccount.tokenMintAccount.address} BALANCE ${tokenAccount.balance}`)
  return await repository.save(entity)
}

export const findOneByTokenAccountAddress = async function(
  tokenAccountAddress: string
): Promise<TokenAccountEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenAccountEntity> = connection.getRepository(TokenAccountEntity)
  return await repository.createQueryBuilder('tb')
    .innerJoin(AccountEntity, 'a', 'a.id = tb.token_account_id')
    .where(`a.address = '${tokenAccountAddress}'`)
    .limit(1)
    .getOne()
}

export const findOneByTokenAccountId = async function(
  tokenAccountId: number
): Promise<TokenAccountEntity | undefined> {
  const connection = await SqlService.connection()
  const repository: Repository<TokenAccountEntity> = connection.getRepository(TokenAccountEntity)
  return await repository.createQueryBuilder()
    .where(`token_account_id = ${tokenAccountId}`)
    .limit(1)
    .getOne()
}