
import { OrderEndingSagaInput, OrderEndingSagaOutput } from "../../core/order/use-cases/order-ending-saga";
import { IUsecase } from "@/utils/usecase";

export abstract class IOrderEndingSagaAdapter implements IUsecase {
  abstract execute(input: OrderEndingSagaInput): Promise<OrderEndingSagaOutput>;
}