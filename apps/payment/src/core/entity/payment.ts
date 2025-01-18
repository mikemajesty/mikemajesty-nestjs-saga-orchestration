import { BaseEntity } from "@/utils/entity";
import { z } from "zod";

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  REFUND = "refund"
}

export enum ValidationStatus {
  SUCCESS="success",
  ROLLBACK_PENDING="rollback_pending",
  FAIL="fail"
}

export const PaymentEntitySchema = z.object({
  id: z.string().uuid(),
  orderId: z.string(),
  transactionId: z.string(),
  totalItems: z.number().positive(),
  totalAmount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus).optional(),
});

type Product = z.infer<typeof PaymentEntitySchema>;

export class PaymentEntity extends BaseEntity<PaymentEntity>() {
  id!: string

  orderId!: string

  transactionId!: string

  totalItems!: number

  totalAmount!: number

  status!: PaymentStatus

  constructor(entity: Product) {
    super(PaymentEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}