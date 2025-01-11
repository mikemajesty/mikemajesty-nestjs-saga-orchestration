import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { IOrderConsumerEndingSagaAdapter } from './adapter';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';
import { OrderConsumerEndingSagaOutput } from '@/core/order/use-cases/order-consumer-ending-saga';
import { EventEntity } from '@/core/event/entity/event';

@Controller()
export class ConsumerController {
  
  constructor(
    private readonly consumerEndindSaga: IOrderConsumerEndingSagaAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.NOTIFY_ENDING)
  async notifyEndind(@Payload() paylod: EventEntity, @Ctx() context: KafkaContext): Promise<OrderConsumerEndingSagaOutput> {
    await this.consumerEndindSaga.execute(new EventEntity(paylod))
    const { offset } = context.getMessage();
    console.log("---------------",offset );
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
  }
}
