import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

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
