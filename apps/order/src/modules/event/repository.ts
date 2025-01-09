import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { MongoRepository } from '@/infra/repository';

import { Event, EventDocument } from '../../infra/databse/schemas/event';
import { IEventRepository } from '@/core/order/repository/event';

@Injectable()
export class EventRepository extends MongoRepository<EventDocument> implements IEventRepository {
  constructor(@InjectModel(Event.name) readonly entity: PaginateModel<EventDocument>) {
    super(entity);
  }
}