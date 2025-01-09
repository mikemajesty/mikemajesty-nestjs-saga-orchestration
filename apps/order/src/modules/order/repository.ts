import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { MongoRepository } from '@/infra/repository';

import { Order, OrderDocument } from '../../infra/databse/schemas/order';
import { IOrderRepository } from '@/core/order/repository/order';

@Injectable()
export class OrderRepository extends MongoRepository<OrderDocument> implements IOrderRepository {
  constructor(@InjectModel(Order.name) readonly entity: PaginateModel<OrderDocument>) {
    super(entity);
  }
}