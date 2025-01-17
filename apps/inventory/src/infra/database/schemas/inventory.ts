import { PaymentStatus } from '@/core/entity/payment';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  Relation,
  JoinColumn
} from 'typeorm';
import { OrderInventorySchema } from './order-inventory';

@Entity({ name: 'inventories' })
export class InventorySchema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column({ type: 'text', nullable: false })
  productCode!: string;

  @Column({ type: 'int', nullable: false })
  available!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}