import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { EventEntity } from '@/core/event/entity/event';
import { OrderConsumerEndingSagaOutput } from '@/core/order/use-cases/order-consumer-ending-saga';

import { TopicsConsumerEnum } from '../../utils/topics';
import { IOrderConsumerEndingSagaAdapter } from './adapter';

@Controller()
export class ConsumerController {
  constructor(
    private readonly consumerEndindSaga: IOrderConsumerEndingSagaAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.NOTIFY_ENDING)
  async notifyEndind(
    @Payload() paylod: EventEntity,
    @Ctx() context: KafkaContext,
  ): Promise<OrderConsumerEndingSagaOutput> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.consumerEndindSaga.execute(new EventEntity(paylod));
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
