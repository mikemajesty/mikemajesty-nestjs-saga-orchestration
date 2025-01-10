import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SwaggerRequest, SwaggerResponse } from './swagger';
import { OrderProducerCreateInput, OrderProducerCreateOutput } from '../../core/order/use-cases/order-producer-create';
import { IOrderProducerCreateAdapter } from './adapter';

@Controller("order")
export class OrderController {

  constructor(
    private readonly producerStartSaga: IOrderProducerCreateAdapter,
  ) { }

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  async create(@Req() { body }: ApiRequest): Promise<OrderProducerCreateOutput> {
    return await this.producerStartSaga.execute(body as OrderProducerCreateInput);
  }
}
