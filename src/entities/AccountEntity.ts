import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "accounts" })
export class AccountEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "address", type: "varchar", length: 128, nullable: false, unique: true})
  address: string

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at",  type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updatedAt: Date
}