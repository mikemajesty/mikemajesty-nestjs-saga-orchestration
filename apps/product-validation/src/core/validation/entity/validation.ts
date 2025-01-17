import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

export enum ProductValidationStatus {
  SUCCESS="success",
  ROLLBACK_PENDING="rollback_pending",
  FAIL="fail"
}

const ID = z.string();
const TransactionId = z.string()
const OrderId = z.string()
const Success = z.boolean()
const CreatedAt = z.date().or(z.string()).nullish().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const ProductValidationEntitySchema = z.object({
  id: ID,
  transactionId: TransactionId,
  orderId: OrderId,
  success: Success,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type ProductValidation = z.infer<typeof ProductValidationEntitySchema>;

export class ProductValidationEntity extends BaseEntity<ProductValidationEntity>() {
  orderId: string

  transactionId: string

  success: boolean

  constructor(entity: ProductValidation) {
    super(ProductValidationEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}