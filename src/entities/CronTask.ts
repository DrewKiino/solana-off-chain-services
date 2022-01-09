import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "cron_tasks" })
export class CronTask {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "cron_expression", type: "varchar", length: 12, nullable: false , unique: true })
    cronExpression: string

    @Column({ name: "task_identifier", type: "varchar", length: 200, nullable: false })
    taskIdentifier: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date
}
