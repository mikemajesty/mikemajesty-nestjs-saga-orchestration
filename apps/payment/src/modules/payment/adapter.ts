import {
  PaymentRealizeInput,
  PaymentRealizeOutput,
} from '@/core/use-cases/payment-realize';
import {
  PaymentRefundInput,
  PaymentRefundOutput,
} from '@/core/use-cases/payment-refund';
import { IUsecase } from '@/utils/usecase';

export abstract class IPaymentRefundAdapter implements IUsecase {
  abstract execute(input: PaymentRefundInput): Promise<PaymentRefundOutput>;
}

export abstract class IPaymentRealizeAdapter implements IUsecase {
  abstract execute(input: PaymentRealizeInput): Promise<PaymentRealizeOutput>;
}
