import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { IOrderConsumerEndingSagaAdapter } from './adapter';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';
import { OrderConsumerEndingSagaOutput } from '@/core/order/use-cases/order-consumer-ending-saga';

@Controller()
export class ConsumerController {
  
  constructor(
    private readonly consumerEndindSaga: IOrderConsumerEndingSagaAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.NOTIFY_ENDING)
  async notifyEndind(@Payload() paylod: any): Promise<OrderConsumerEndingSagaOutput> {
    return this.consumerEndindSaga.execute(paylod)
  }
}