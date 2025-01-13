import { z } from 'zod';

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

  async execute(input: OrderConsumerEndingSagaInput): Promise<OrderConsumerEndingSagaOutput> {
    try {
      const model = OrderConsumerEndingSagaInputSchema.parse(input)
      this.logger.setGlobalParameters({ traceId: model.transactionId })
      this.logger.info({ message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${model.transactionId}, orderId: ${model.orderId} => payload received`, obj: { payload: model } })
      await this.eventRepository.updateOne({ orderId: model.orderId, transactionId: model.transactionId }, model)
      this.logger.info({ message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${model.transactionId}, orderId: ${model.orderId} => event created`, obj: { payload: model } })
    } catch (error) {
      error.context = OrderConsumerFinishSagaUsecase.name
      this.logger.error(error)
    }
  }
}

export type OrderConsumerEndingSagaInput = z.infer<typeof OrderConsumerEndingSagaInputSchema>;
export type OrderConsumerEndingSagaOutput = void;
