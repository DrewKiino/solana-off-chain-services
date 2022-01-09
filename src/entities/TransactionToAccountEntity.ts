import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {AccountEntity} from './AccountEntity';
import {TransactionEntity} from './TransactionEntity';

@Entity({ name: "transactions_to_accounts" })
export class TransactionToAccountEntity {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => AccountEntity)
  @JoinColumn({ name: "account_id" })
  account: AccountEntity

  @ManyToOne(type => TransactionEntity)
  @JoinColumn({ name: "transaction_id" })
  transaction: TransactionEntity

  @CreateDateColumn({ name: "created_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updatedAt: Date
}