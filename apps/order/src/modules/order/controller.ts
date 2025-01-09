import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SwaggerRequest, SwaggerResponse } from './swagger';
import { OrderProducerCreateInput, OrderProducerCreateOutput } from '../../core/order/use-cases/order-producer-create';
import { IOrderConsumerEndingSagaAdapter, IOrderProducerCreateAdapter } from './adapter';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';
import { OrderConsumerEndingSagaOutput } from '@/core/order/use-cases/order-consumer-ending-saga';

@Controller("order")
export class OrderController {
  
  constructor(
    private readonly producerStartSaga: IOrderProducerCreateAdapter,
    private readonly consumerEndindSaga: IOrderConsumerEndingSagaAdapter,
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  async create(@Req() { body }: ApiRequest): Promise<OrderProducerCreateOutput> {
    return await this.producerStartSaga.execute(body as OrderProducerCreateInput);
  }

  @MessagePattern(TopicsConsumerEnum.NOTIFY_ENDING)
  async notifyEndind(@Payload() paylod: any): Promise<OrderConsumerEndingSagaOutput> {
    console.log("ssssssssssssssssssssssssssssssssssssss");
    return this.consumerEndindSaga.execute(paylod)
  }
}
