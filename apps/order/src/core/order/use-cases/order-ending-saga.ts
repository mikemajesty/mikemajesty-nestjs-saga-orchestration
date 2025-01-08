import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrderEndingSagaAdapter } from '../../../modules/consume/adapter';

export const OrderEndingSagaInputSchema = z.any();

export class OrderFinishSagaUsecase implements IOrderEndingSagaAdapter {
  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderEndingSagaInputSchema)
  async execute(input: OrderEndingSagaInput): Promise<OrderEndingSagaOutput> {
    this.logger.info({ message: "............................ending saga received............................", obj: { payload: input } })
    return input;
  }
}

export type OrderEndingSagaInput = z.infer<typeof OrderEndingSagaInputSchema>;
export type OrderEndingSagaOutput = void;
