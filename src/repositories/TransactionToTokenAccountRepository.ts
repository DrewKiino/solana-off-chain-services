import {TokenAccountEntity} from '../entities/TokenAccountEntity';
import * as SqlService from '../services/SqlService';
import {Repository} from 'typeorm';
import {TransactionEntity} from '../entities/TransactionEntity';

export const listTransactionsWithNoTokenAccounts = async function(
  limit: number
): Promise<TransactionEntity[]> {
  const connection = await SqlService.connection()
  const repository: Repository<TransactionEntity> = connection.getRepository(TransactionEntity)
  return await repository.createQueryBuilder('t')
    .where('t.id NOT IN (SELECT transaction_id id FROM token_accounts)')
    .limit(limit)
    .getMany()
}
