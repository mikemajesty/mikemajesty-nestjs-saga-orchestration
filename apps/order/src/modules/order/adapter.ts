import { OrderStartSagaInput, OrderStartSagaOutput } from "@/core/order/use-cases/order-start-saga";
import { IUsecase } from "@/utils/usecase";

export abstract class IOrderStartSagaAdapter implements IUsecase {
  abstract execute(input: OrderStartSagaInput): Promise<OrderStartSagaOutput>;
}