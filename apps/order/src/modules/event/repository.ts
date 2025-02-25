import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel } from 'mongoose';

import { EventEntity } from '@/core/event/entity/event';
import { IEventRepository } from '@/core/event/repository/event';
import {
  EventListInput,
  EventListOutput,
} from '@/core/event/use-cases/event-list';
import { MongoRepository } from '@/infra/repository';
import {
  ConvertMongooseFilter,
  SearchTypeEnum,
  ValidateDatabaseSortAllowed,
} from '@/utils/decorators';
import { IEntity } from '@/utils/entity';

import { Event, EventDocument } from '../../infra/databse/schemas/event';

@Injectable()
export class EventRepository
  extends MongoRepository<EventDocument>
  implements IEventRepository
{
  constructor(
    @InjectModel(Event.name) readonly entity: PaginateModel<EventDocument>,
  ) {
    super(entity);
  }

  @ValidateDatabaseSortAllowed<EventEntity>({ name: 'createdAt' })
  @ConvertMongooseFilter<EventEntity>([
    { name: 'orderId', type: SearchTypeEnum.equal },
    { name: 'transactionId', type: SearchTypeEnum.equal },
  ])
  async paginate({
    limit,
    page,
    search,
    sort,
  }: EventListInput): Promise<EventListOutput> {
    const events = await this.entity.paginate(search as FilterQuery<IEntity>, {
      page,
      limit,
      sort: sort as object,
    });

    return {
      docs: events.docs.map(
        (u) => new EventEntity(u.toObject({ virtuals: true })),
      ),
      limit,
      page,
      total: events.totalDocs,
    };
  }
}
