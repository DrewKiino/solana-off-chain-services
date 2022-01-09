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

@Entity({ name: "token_infos" })
export class TokenInfoEntity {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => AccountEntity)
  @JoinColumn({ name: "token_mint_account_id" })
  tokenMintAccount: AccountEntity

  @Column({name: "symbol", type: "varchar", length: 64, nullable: false })
  symbol: string

  @Column({ name: "decimals", type: "tinyint", nullable: false })
  decimals: number

  @Column({name: "logo_uri", type: "varchar", length: 256, nullable: true })
  logoUri: string | undefined

  @Column({name: "website", type: "varchar", length: 256, nullable: true })
  website: string | undefined

  @Column({name: "coingecko_id", type: "varchar", length: 64, nullable: true })
  coingeckoId: string | undefined

  @CreateDateColumn({ name: "created_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updatedAt: Date
}