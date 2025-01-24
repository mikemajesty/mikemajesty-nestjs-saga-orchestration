import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { IEventRepository } from '@/core/event/repository/event';
import { IOrderRepository } from '@/core/order/repository/order';
import { OrderProducerCreateUsecase } from '@/core/order/use-cases/order-producer-create';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

import { DatabaseModule } from '../../infra/databse';
import { ConnectionName } from '../../infra/databse/enum';
import {
  Order,
  OrderDocument,
  OrderSchema,
} from '../../infra/databse/schemas/order';
import { KafkaModule } from '../../infra/kafka/module';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ProducerModule } from '../../infra/producer/module';
import { EventModule } from '../event/module';
import { IOrderProducerCreateAdapter } from './adapter';
import { OrderController } from './controller';
import { OrderRepository } from './repository';
@Module({
  imports: [
    LoggerModule,
    SecretsModule,
    KafkaModule,
    DatabaseModule,
    EventModule,
    ProducerModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderRepository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<OrderDocument>;

        const repository: PaginateModel<OrderDocument> = connection.model<
          OrderDocument,
          Model
        >(Order.name, OrderSchema as Schema);

        return new OrderRepository(repository);
      },
      inject: [getConnectionToken(ConnectionName.ORDER)],
    },
    {
      provide: IOrderProducerCreateAdapter,
      useFactory(
        producer: IProducerAdapter,
        logger: ILoggerAdapter,
        orderRepository: IOrderRepository,
        eventRepository: IEventRepository,
      ) {
        return new OrderProducerCreateUsecase(
          producer,
          logger,
          orderRepository,
          eventRepository,
        );
      },
      inject: [
        IProducerAdapter,
        ILoggerAdapter,
        IOrderRepository,
        IEventRepository,
      ],
    },
  ],
  exports: [IOrderProducerCreateAdapter, IOrderRepository],
})
export class OrderModule {}
