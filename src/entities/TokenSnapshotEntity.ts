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

@Entity({ name: "token_snapshots" })
export class TokenSnapshotEntity {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => AccountEntity)
  @JoinColumn({ name: "token_account_id" })
  tokenAccount: AccountEntity

  @Column({ name: 'token_account_id' })
  tokenAccountId: number

  @Column({ name: "decimals", type: "int", nullable: false })
  decimals: number

  @Column({ name: "price", type: "decimal", precision: 36, scale: 18, nullable: false })
  price: number

  @Column({ name: "supply", type: "decimal", precision: 36, scale: 18, nullable: false })
  supply: number

  @Column({ name: "market_cap", type: "decimal", precision: 36, scale: 18, nullable: false })
  marketCap: number

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date
}
