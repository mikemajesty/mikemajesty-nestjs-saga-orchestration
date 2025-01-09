import { OrderProducerCreateInput, OrderProducerCreateOutput } from "@/core/order/use-cases/order-producer-create";
import { OrderConsumerEndingSagaInput, OrderConsumerEndingSagaOutput } from "@/core/order/use-cases/order-consumer-ending-saga";
import { IUsecase } from "@/utils/usecase";

export abstract class IOrderProducerCreateAdapter implements IUsecase {
  abstract execute(input: OrderProducerCreateInput): Promise<OrderProducerCreateOutput>;
}

export abstract class IOrderConsumerEndingSagaAdapter implements IUsecase {
  abstract execute(input: OrderConsumerEndingSagaInput): Promise<OrderConsumerEndingSagaOutput>;
}