import {
  OrderProducerCreateInput,
  OrderProducerCreateOutput,
} from '@/core/order/use-cases/order-producer-create';
import { IUsecase } from '@/utils/usecase';

export abstract class IOrderProducerCreateAdapter implements IUsecase {
  abstract execute(
    input: OrderProducerCreateInput,
  ): Promise<OrderProducerCreateOutput>;
}
