import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrderConsumerEndingSagaAdapter } from '../../../modules/consumer/adapter';
import { EventEntity, EventEntitySchema } from '../../event/entity/event';
import { TopicsConsumerEnum } from 'apps/order/src/utils/topics';
import { IEventRepository } from '@/core/event/repository/event';
import { UUIDUtils } from '@/utils/uuid';

export const OrderConsumerEndingSagaInputSchema = EventEntitySchema

export class OrderConsumerFinishSagaUsecase implements IOrderConsumerEndingSagaAdapter {
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly eventRepository: IEventRepository,
  ) {}

  @ValidateSchema(OrderConsumerEndingSagaInputSchema)
  async execute(input: OrderConsumerEndingSagaInput): Promise<OrderConsumerEndingSagaOutput> {
    this.logger.setGlobalParameters({ traceId: input.transactionId })
    this.logger.info({ message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${input.transactionId}, orderId: ${input.id} => payload received`, obj: { payload: input } })
    await this.eventRepository.updateOne({ orderId: input.orderId, transactionId: input.transactionId }, input)
    this.logger.info({ message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${input.transactionId}, orderId: ${input.id} => event created`, obj: { payload: input } })
  }
}

export type OrderConsumerEndingSagaInput = z.infer<typeof OrderConsumerEndingSagaInputSchema>;
export type OrderConsumerEndingSagaOutput = void;
