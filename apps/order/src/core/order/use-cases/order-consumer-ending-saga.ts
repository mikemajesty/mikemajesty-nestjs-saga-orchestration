import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrderConsumerEndingSagaAdapter } from '../../../modules/consumer/adapter';
import { IEventRepository } from '../repository/event';
import { EventEntity, EventEntitySchema } from '../entity/event';
import { TopicsConsumerEnum } from 'apps/order/src/utils/topics';

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
    input.createdAt = new Date()
    const event = new EventEntity(input)
    await this.eventRepository.create(new EventEntity(input))
    this.logger.info({ message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${input.transactionId}, orderId: ${input.id} => event created`, obj: { payload: event } })
  }
}

export type OrderConsumerEndingSagaInput = z.infer<typeof OrderConsumerEndingSagaInputSchema>;
export type OrderConsumerEndingSagaOutput = void;
