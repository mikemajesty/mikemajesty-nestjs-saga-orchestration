import { OrderCreateInput, OrderCreateOutput } from "@/core/order/use-cases/order-create";
import { IUsecase } from "@/utils/usecase";

export abstract class IOrderCreateAdapter implements IUsecase {
  abstract execute(input: OrderCreateInput): Promise<OrderCreateOutput>;
}