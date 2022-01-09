import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "transactions" })
export class TransactionEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "signature", type: "varchar", length: 128, nullable: false, unique: true})
  signature: string

  @Column({name: "slot", type: "int", nullable: true})
  slot: number

  @Column({name: "block_time", type: "int", nullable: true})
  blockTime: number | null | undefined

  @Column({name: "memo", type: "varchar", length: 32, nullable: true})
  memo: string | null | undefined

  @CreateDateColumn({ name: "created_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updatedAt: Date
}