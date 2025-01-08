import { Module } from '@nestjs/common';

import { OrderController } from './controller';
import { ConsumerModule } from '../../infra/consumer/modules';
import { ProducerModule } from '../../infra/producer/modules';
import { IOrderStartSagaAdapter } from './adapter';
import { OrderStartSagaUsecase } from '@/core/order/use-cases/order-start-saga';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

@Module({
  imports: [ConsumerModule, ProducerModule, LoggerModule],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderStartSagaAdapter,
      useFactory(producer: IProducerAdapter, logger: ILoggerAdapter) {
          return new OrderStartSagaUsecase(producer, logger)
      },
      inject: [IProducerAdapter, ILoggerAdapter]
    },
  ],
  exports: [IOrderStartSagaAdapter]
})
export class OrderModule {}
