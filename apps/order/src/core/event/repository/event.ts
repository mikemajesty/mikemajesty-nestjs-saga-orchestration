import { IRepository } from '@/infra/repository';

import { EventEntity } from '../entity/event';
import { EventListInput, EventListOutput } from '../use-cases/event-list';

export abstract class IEventRepository extends IRepository<EventEntity> {
  abstract paginate(input: EventListInput): Promise<EventListOutput>;
}
