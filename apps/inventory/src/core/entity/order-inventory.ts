import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

import { InventoryEntity, InventoryEntitySchema } from './inventory';

export enum OrderInventoryStatus {
  SUCCESS = 'SUCCESS',
  ROLLBACK_PENDING = 'ROLLBACK_PENDING',
  FAIL = 'FAIL',
}

const CreatedAt = z.date().or(z.string()).nullish().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const OrderInventoryEntitySchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  orderId: z.string(),
  orderQuantity: z.number(),
  inventory: InventoryEntitySchema,
  oldQuantity: z.number(),
  newQuantity: z.number(),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt,
});

type Product = z.infer<typeof OrderInventoryEntitySchema>;

export class OrderInventoryEntity extends BaseEntity<OrderInventoryEntity>() {
  transactionId!: string;

  orderId!: string;

  orderQuantity!: number;

  oldQuantity!: number;

  newQuantity!: number;

  inventory: InventoryEntity;

  constructor(entity: Product) {
    super(OrderInventoryEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
