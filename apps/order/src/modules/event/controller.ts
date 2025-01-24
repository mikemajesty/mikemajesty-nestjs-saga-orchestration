import { Controller, Get, Req, Version } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import {
  EventListInput,
  EventListOutput,
} from '@/core/event/use-cases/event-list';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema, SearchType } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import { IEventListAdapter } from './adapter';
import { SwaggerRequest } from './swagger';

@Controller('/events')
export class EventController {
  constructor(private readonly listUsecase: IEventListAdapter) {}

  @Get()
  @ApiQuery(SwaggerRequest.list.pagination.limit)
  @ApiQuery(SwaggerRequest.list.pagination.page)
  @ApiQuery(SwaggerRequest.list.sort)
  @ApiQuery(SwaggerRequest.list.search)
  @Version('1')
  async list(@Req() { query }: ApiRequest): Promise<EventListOutput> {
    const input: EventListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search) as SearchType,
      limit: Number(query.limit),
      page: Number(query.page),
    };

    return await this.listUsecase.execute(input);
  }
}
