import { IEventListAdapter } from 'apps/order/src/modules/event/adapter';
import { z } from 'zod';

import { PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';

import { EventEntity } from '../entity/event';
import { IEventRepository } from '../repository/event';

export const EventListInputSchema = z.intersection(
  PaginationSchema,
  SortSchema.merge(SearchSchema),
);

export class EventListUsecase implements IEventListAdapter {
  constructor(private readonly eventRepository: IEventRepository) {}
  async execute(input: EventListInput): Promise<EventListOutput> {
    const model = EventListInputSchema.parse(input);
    return await this.eventRepository.paginate(model);
  }
}

export type EventListInput = z.infer<typeof EventListInputSchema>;
export type EventListOutput = PaginationOutput<EventEntity>;
