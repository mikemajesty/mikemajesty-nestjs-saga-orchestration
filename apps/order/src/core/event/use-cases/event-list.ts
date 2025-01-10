import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { SortSchema } from '@/utils/sort';
import { PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';

import { EventEntity, EventEntitySchema } from '../entity/event';
import { IEventListAdapter } from 'apps/order/src/modules/event/adapter';
import { IEventRepository } from '../repository/event';

export const EventListInputSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export class EventListUsecase implements IEventListAdapter {
  constructor(private readonly eventRepository: IEventRepository) {}
  @ValidateSchema(EventListInputSchema)
  async execute(input: EventListInput): Promise<EventListOutput> {
    return await this.eventRepository.paginate(input);
  }
}

export type EventListInput = z.infer<typeof EventListInputSchema>;
export type EventListOutput = PaginationOutput<EventEntity>;
