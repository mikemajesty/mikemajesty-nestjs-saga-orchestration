import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrderConsumerEndingSagaAdapter } from '../../../modules/order/adapter';

export const OrderConsumerEndingSagaInputSchema = z.any();

export class OrderConsumerFinishSagaUsecase implements IOrderConsumerEndingSagaAdapter {
  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderConsumerEndingSagaInputSchema)
  async execute(input: OrderConsumerEndingSagaInput): Promise<OrderConsumerEndingSagaOutput> {
    this.logger.info({ message: "............................consumer ending saga received............................", obj: { payload: input } })
    return input;
  }
}

export type OrderConsumerEndingSagaInput = z.infer<typeof OrderConsumerEndingSagaInputSchema>;
export type OrderConsumerEndingSagaOutput = void;
