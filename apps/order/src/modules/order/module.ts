import { Module } from '@nestjs/common';

import { OrderController } from './controller';
import { NotifyEndingModule } from '../../infra/consumers/modules';
import { ProducerModule } from '../../infra/producer/modules';
import { IOrderCreateAdapter } from './adapter';
import { OrderCreateUsecase } from '@/core/order/use-cases/order-create';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

@Module({
  imports: [NotifyEndingModule, ProducerModule, LoggerModule],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderCreateAdapter,
      useFactory(producer: IProducerAdapter, logger: ILoggerAdapter) {
          return new OrderCreateUsecase(producer, logger)
      },
      inject: [IProducerAdapter, ILoggerAdapter]
    },
  ],
  exports: [IOrderCreateAdapter]
})
export class OrderModule {}
