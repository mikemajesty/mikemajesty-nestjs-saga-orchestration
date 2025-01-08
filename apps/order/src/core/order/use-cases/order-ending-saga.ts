import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrderEndingSagaInputSchema = z.any();

export class OrderFinishSagaUsecase implements IUsecase {
  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderEndingSagaInputSchema)
  async execute(input: OrderEndingSagaInput): Promise<OrderEndingSagaOutput> {
    this.logger.info({ message: "............................ending saga received............................", obj: { payload: input } })
    return input;
  }
}

export type OrderEndingSagaInput = z.infer<typeof OrderEndingSagaInputSchema>;
export type OrderEndingSagaOutput = void;
