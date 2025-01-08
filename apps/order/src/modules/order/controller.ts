import { ApiRequest } from '@/utils/request';
import { Controller, Get, Post, Req, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SwaggerRequest, SwaggerResponse } from './swagger';
import { OrderCreateInput, OrderCreateOutput } from '../../core/order/use-cases/order-create';
import { IOrderCreateAdapter } from './adapter';

@Controller("order")
export class OrderController {
  
  constructor(private readonly createUsecase: IOrderCreateAdapter) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  async create(@Req() { body }: ApiRequest): Promise<OrderCreateOutput> {
    return await this.createUsecase.execute(body as OrderCreateInput);
  }
}
