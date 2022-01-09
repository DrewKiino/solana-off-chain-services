import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToOne, OneToMany, ManyToMany,
} from "typeorm";
import {TransactionEntity} from './TransactionEntity';
import {AccountEntity} from './AccountEntity';

@Entity({ name: "token_accounts" })
export class TokenAccountEntity {

  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => AccountEntity)
  @JoinColumn({ name: "token_account_id" })
  tokenAccount: AccountEntity

  @ManyToOne(type => AccountEntity)
  @JoinColumn({ name: "token_mint_account_id" })
  tokenMintAccount: AccountEntity

  @OneToOne(type => AccountEntity)
  @JoinColumn({ name: "token_owner_account_id" })
  tokenOwnerAccount: AccountEntity

  @Column({ name: "balance", type: "decimal", precision: 36, scale: 18, nullable: false })
  balance: number

  @CreateDateColumn({ name: "created_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updatedAt: Date
}
