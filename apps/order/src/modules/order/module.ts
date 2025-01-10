import { Module } from '@nestjs/common';

import { OrderController } from './controller';
import { IOrderProducerCreateAdapter } from './adapter';
import { OrderProducerCreateUsecase } from '@/core/order/use-cases/order-producer-create';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { KafkaModule } from '../../infra/kafka/module';
import { IKafkaAdapter } from '../../infra/kafka/adapter';
import { OrderConsumerFinishSagaUsecase } from '@/core/order/use-cases/order-consumer-ending-saga';
import { DatabaseModule } from '../../infra/databse';
import { IOrderRepository } from '@/core/order/repository/order';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';
import { Order, OrderDocument, OrderSchema } from '../../infra/databse/schemas/order';
import { OrderRepository } from './repository';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionName } from '../../infra/databse/enum';
import { EventModule } from '../event/module';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ProducerModule } from '../../infra/producer/module';
@Module({
  imports: [LoggerModule, SecretsModule, KafkaModule, DatabaseModule, EventModule, ProducerModule],
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
      inject: [getConnectionToken(ConnectionName.ORDER)]
    },
    {
      provide: IOrderProducerCreateAdapter,
      useFactory(producer: IProducerAdapter, logger: ILoggerAdapter, orderRepository: IOrderRepository) {
          return new OrderProducerCreateUsecase(producer, logger, orderRepository)
      },
      inject: [IProducerAdapter, ILoggerAdapter, IOrderRepository]
    },
  ],
  exports: [IOrderProducerCreateAdapter, IOrderRepository]
})
export class OrderModule {}
