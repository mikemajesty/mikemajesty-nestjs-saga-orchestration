import { ILoggerAdapter } from '@/infra/logger';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from 'apps/order/src/infra/producer/adapter';
import { TopicsEnum } from 'apps/order/src/utils/topics';

export const OrderStartSagaInputSchema = z.any()

export class OrderStartSagaUsecase implements IUsecase {

  constructor(private readonly producer: IProducerAdapter, private  readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderStartSagaInputSchema)
  async execute(input: OrderStartSagaInput): Promise<void> {
    this.logger.info({ message: "starting saga.......", obj: { payload: input } })
    return this.producer.publish({ messages: [{ value: JSON.stringify(input)  }], topic: TopicsEnum.START_SAGA })
  }
}

export type OrderStartSagaInput = z.infer<typeof OrderStartSagaInputSchema>;
export type OrderStartSagaOutput = void;
