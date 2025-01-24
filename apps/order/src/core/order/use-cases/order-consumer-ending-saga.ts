import { TopicsConsumerEnum } from 'apps/order/src/utils/topics';

import { IEventRepository } from '@/core/event/repository/event';
import { ILoggerAdapter } from '@/infra/logger';

import { IOrderConsumerEndingSagaAdapter } from '../../../modules/consumer/adapter';
import { EventEntity } from '../../event/entity/event';

export class OrderConsumerFinishSagaUsecase
  implements IOrderConsumerEndingSagaAdapter
{
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(
    input: OrderConsumerEndingSagaInput,
  ): Promise<OrderConsumerEndingSagaOutput> {
    try {
      const model = new EventEntity(input);
      this.logger.setGlobalParameters({ traceId: model.transactionId });
      this.logger.info({
        message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${model.transactionId}, orderId: ${model.orderId} => payload received`,
      });
      await this.eventRepository.updateOne(
        { orderId: model.orderId, transactionId: model.transactionId },
        model,
      );
      this.logger.info({
        message: `consumer: ${TopicsConsumerEnum.NOTIFY_ENDING}, transaction: ${model.transactionId}, orderId: ${model.orderId} => event created`,
      });
    } catch (error) {
      error.context = OrderConsumerFinishSagaUsecase.name;
      error.parameters = {
        info: 'error trying to ending saga',
      };
      this.logger.error(error);
    }
  }
}

export type OrderConsumerEndingSagaInput = EventEntity;
export type OrderConsumerEndingSagaOutput = void;
