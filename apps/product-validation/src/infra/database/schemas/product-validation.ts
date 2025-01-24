import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
/**
 *@description  usado para garantir a imdepotencia do evento
 */
@Entity({ name: 'products_validation' })
export class ProductValidationSchema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column({ type: 'text', nullable: false })
  orderId!: string;

  @Column({ type: 'text', nullable: false })
  transactionId!: string;
  /**
   *@description  //propriedade usada para verificar se o evento esta com falha ou não
   */
  @Column({ type: 'bool', nullable: false })
  success!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}
