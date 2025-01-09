import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { EventRepository } from './repository';
import { DatabaseModule } from '../../infra/databse';
import { IEventRepository } from '@/core/order/repository/event';
import { Event, EventDocument, EventSchema } from '../../infra/databse/schemas/event';
import { ConnectionName } from '../../infra/databse/enum';

@Module({
  imports: [LoggerModule],
  controllers: [],
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
    }
  ],
  exports: [IEventRepository]
})
export class EventModule {}