import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

import { OrderProductEntity, OrderProductEntitySchema } from './order-product';

const ID = z.string();
const Products = z.array(OrderProductEntitySchema).min(1);
const TransactionId = z.string().optional();
const TotalItems = z.number().positive().optional();
const TotalIAmount = z
  .number()
  .or(z.string())
  .transform((value) => Number(value))
  .nullable()
  .optional();
const CreatedAt = z.date().or(z.string()).nullish().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const OrderEntitySchema = z.object({
  id: ID,
  products: Products,
  transactionId: TransactionId,
  totalItems: TotalItems,
  totalAmount: TotalIAmount,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt,
});

type Order = z.infer<typeof OrderEntitySchema>;

export class OrderEntity extends BaseEntity<OrderEntity>() {
  products: OrderProductEntity[];

  transactionId: string;

  totalItems: number;

  totalAmount: number;

  constructor(entity: Order) {
    super(OrderEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
