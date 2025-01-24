import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'SUCCESS',
  REFUND = 'refund',
}

export enum ValidationStatus {
  SUCCESS = 'SUCCESS',
  ROLLBACK_PENDING = 'ROLLBACK_PENDING',
  FAIL = 'FAIL',
}

export const PaymentEntitySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  transactionId: z.string(),
  totalItems: z.number().positive(),
  totalAmount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus).optional(),
});

type Product = z.infer<typeof PaymentEntitySchema>;

export class PaymentEntity extends BaseEntity<PaymentEntity>() {
  id!: string;

  orderId!: string;

  transactionId!: string;

  totalItems!: number;

  totalAmount!: number;

  status!: PaymentStatus;

  constructor(entity: Product) {
    super(PaymentEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
