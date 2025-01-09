import { ILoggerAdapter } from '@/infra/logger';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { TopicsEnum } from '../../../utils/topics';
import { IOrderCreateAdapter } from '../../../modules/order/adapter';
import { IKafkaAdapter } from 'apps/order/src/infra/kafka/adapter';

export const OrderCreateInputSchema = z.any()

export class OrderCreateUsecase implements IOrderCreateAdapter {

  constructor(private readonly kafka: IKafkaAdapter, private  readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrderCreateInputSchema)
  async execute(input: OrderCreateInput): Promise<any> {
    this.logger.info({ message: "............................create order received............................", obj: { payload: input } })
  }
}

export type OrderCreateInput = z.infer<typeof OrderCreateInputSchema>;
export type OrderCreateOutput = void;
