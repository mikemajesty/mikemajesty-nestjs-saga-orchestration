import { z } from 'zod';

import { SortSchema } from '@/utils/sort';
import { PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';

import { EventEntity, EventEntitySchema } from '../entity/event';
import { IEventListAdapter } from 'apps/order/src/modules/event/adapter';
import { IEventRepository } from '../repository/event';

export const EventListInputSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export class EventListUsecase implements IEventListAdapter {
  constructor(private readonly eventRepository: IEventRepository) {}
  async execute(input: EventListInput): Promise<EventListOutput> {
    const model = EventListInputSchema.parse(input)
    return await this.eventRepository.paginate(model);
  }
}

export type EventListInput = z.infer<typeof EventListInputSchema>;
export type EventListOutput = PaginationOutput<EventEntity>;
