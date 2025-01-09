import { ILoggerAdapter } from '@/infra/logger';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { TopicsProducerEnum } from '../../../utils/topics';
import { IOrderProducerCreateAdapter } from '../../../modules/order/adapter';
import { IKafkaAdapter } from 'apps/order/src/infra/kafka/adapter';

export const OrderProducerCreateInputSchema = z.any()

export class OrderProducerCreateUsecase implements IOrderProducerCreateAdapter {

  constructor(private readonly kafka: IKafkaAdapter, private  readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderProducerCreateInputSchema)
  async execute(input: OrderProducerCreateInput): Promise<any> {
    this.logger.info({ message: "............................producer order create received............................", obj: { payload: input } })
  }
}

export type OrderProducerCreateInput = z.infer<typeof OrderProducerCreateInputSchema>;
export type OrderProducerCreateOutput = void;
