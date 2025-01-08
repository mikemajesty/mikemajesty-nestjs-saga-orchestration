import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SwaggerRequest, SwaggerResponse } from './swagger';
import { OrderStartSagaInput, OrderStartSagaOutput } from '../../core/order/use-cases/order-start-saga';
import { IOrderStartSagaAdapter } from './adapter';

@Controller("order")
export class OrderController {
  
  constructor(private readonly createUsecase: IOrderStartSagaAdapter) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  async create(@Req() { body }: ApiRequest): Promise<OrderStartSagaOutput> {
    return await this.createUsecase.execute(body as OrderStartSagaInput);
  }
}
