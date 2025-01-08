import { ILoggerAdapter } from '@/infra/logger';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { IProducerAdapter } from '../../../infra/producer/adapter';
import { TopicsEnum } from '../../../utils/topics';
import { IOrderCreateAdapter } from '../../../modules/order/adapter';

export const OrderCreateInputSchema = z.any()

export class OrderCreateUsecase implements IOrderCreateAdapter {

  constructor(private readonly producer: IProducerAdapter, private  readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderCreateInputSchema)
  async execute(input: OrderCreateInput): Promise<void> {
    this.logger.info({ message: "............................create order received............................", obj: { payload: input } })
    return this.producer.publish({ messages: [{ value: JSON.stringify(input)  }], topic: TopicsEnum.START_SAGA })
  }
}

export type OrderCreateInput = z.infer<typeof OrderCreateInputSchema>;
export type OrderCreateOutput = void;
