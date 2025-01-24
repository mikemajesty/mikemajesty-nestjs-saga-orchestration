import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

import { PaymentStatus } from '@/core/entity/payment';

@Entity({ name: 'payments' })
export class PaymentSchema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column({ type: 'text', nullable: false })
  orderId!: string;

  @Column({ type: 'text', nullable: false })
  transactionId!: string;

  @Column({ type: 'int', nullable: false })
  totalItems!: number;

  @Column({ type: 'decimal', nullable: false })
  totalAmount!: number;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: false })
  status!: PaymentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;

  @BeforeInsert()
  async prePerssit() {
    this.status = PaymentStatus.PENDING;
  }
}
