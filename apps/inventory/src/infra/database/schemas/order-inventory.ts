import { PaymentStatus } from '@/core/entity/payment';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
  BeforeInsert,
  Relation,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { InventorySchema } from './inventory';
import { InventoryEntity } from '@/core/entity/inventory';

@Entity({ name: 'orders-inventory' })
export class OrderInventorySchema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column({ type: 'text', nullable: false })
  orderId!: string;

  @Column({ type: 'text', nullable: false })
  transactionId!: string;

  @Column({ type: 'int', nullable: false })
  // orderQuantity cann't be  > oldQuantity
  orderQuantity!: number

  @Column({ type: 'int', nullable: false })
  // in case of fail, rollback to this property
  oldQuantity!: number

  @Column({ type: 'int', nullable: false })
  // orderQuantity - oldQuantity
  newQuantity!: number
  
  @ManyToOne(() => InventorySchema, { cascade: ["insert", "update", "remove"], nullable: false, eager: true })
  inventory: Relation<InventorySchema>

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}