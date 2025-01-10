import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { EventRepository } from './repository';
import { DatabaseModule } from '../../infra/databse';
import { Event, EventDocument, EventSchema } from '../../infra/databse/schemas/event';
import { ConnectionName } from '../../infra/databse/enum';
import { IEventRepository } from '@/core/event/repository/event';
import { IEventListAdapter } from './adapter';
import { EventListUsecase } from '@/core/event/use-cases/event-list';
import { EventController } from './controller';

@Module({
  imports: [LoggerModule],
  controllers: [EventController],
  providers: [
    {
      provide: IEventRepository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<EventDocument>;

        const repository: PaginateModel<EventDocument> = connection.model<
          EventDocument,
          Model
        >(Event.name, EventSchema as Schema);

        return new EventRepository(repository);
      },
      inject: [getConnectionToken(ConnectionName.ORDER)]
    },
    {
      provide: IEventListAdapter,
      useFactory(repository: IEventRepository) {
        return new EventListUsecase(repository)
      },
      inject: [IEventRepository]
    }
  ],
  exports: [IEventRepository, IEventListAdapter]
})
export class EventModule { }