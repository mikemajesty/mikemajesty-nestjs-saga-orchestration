import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { IOrderRepository } from '@/core/order/repository/order';
import { MongoRepository } from '@/infra/repository';

import { Order, OrderDocument } from '../../infra/databse/schemas/order';

@Injectable()
export class OrderRepository
  extends MongoRepository<OrderDocument>
  implements IOrderRepository
{
  constructor(
    @InjectModel(Order.name) readonly entity: PaginateModel<OrderDocument>,
  ) {
    super(entity);
  }
}
