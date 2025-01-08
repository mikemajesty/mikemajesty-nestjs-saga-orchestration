import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';
import { OrderProductEntity, OrderProductEntitySchema } from './order-product';

const ID = z.string().uuid();
const Products = z.array(OrderProductEntitySchema).min(1)
const TransactionId = z.string()
const TotalItems = z.number().positive()
const TotalIAmount = z.number().positive()
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const OrderEntitySchema = z.object({
  id: ID,
  products: Products,
  transactionId: TransactionId,
  totalItems: TotalItems,
  totalAmount: TotalIAmount,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Order = z.infer<typeof OrderEntitySchema>;

export class OrderEntity extends BaseEntity<OrderEntity>() {
  products: OrderProductEntity[]

  transactionId: string

  totalItems: number

  totalAmount: number

  constructor(entity: Order) {
    super(OrderEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}