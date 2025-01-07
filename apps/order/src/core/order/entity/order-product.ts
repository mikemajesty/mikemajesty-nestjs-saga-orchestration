import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';
import { ProductEntity, ProductEntitySchema } from './product';

const Product = ProductEntitySchema.required()
const Quantity = z.number()
const CreatedAt = z.date().nullish();

export const OrderProductEntitySchema = z.object({
  product: Product,
  quantity: Quantity,
  createdAt: CreatedAt,
});

type OrderProduct = z.infer<typeof OrderProductEntitySchema>;

export class OrderProductEntity extends BaseEntity<OrderProductEntity>() {
  product!: ProductEntity;

  quantity!: number;

  constructor(entity: OrderProduct) {
    super(OrderProductEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}