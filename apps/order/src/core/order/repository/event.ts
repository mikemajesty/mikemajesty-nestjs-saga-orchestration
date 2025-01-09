import { IRepository } from '@/infra/repository';

import { EventEntity } from '../entity/event';

export abstract class IEventRepository extends IRepository<EventEntity> {
}