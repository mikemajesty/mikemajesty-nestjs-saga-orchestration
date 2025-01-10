import { Module } from '@nestjs/common';

import { ConsumerController } from './controller';
import { IOrderConsumerEndingSagaAdapter } from './adapter';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';
import { KafkaModule } from '../../infra/kafka/module';
import { OrderConsumerFinishSagaUsecase } from '@/core/order/use-cases/order-consumer-ending-saga';
import { EventModule } from '../event/module';
import { IEventRepository } from '@/core/event/repository/event';

@Module({
  imports: [LoggerModule, SecretsModule, KafkaModule, EventModule],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IOrderConsumerEndingSagaAdapter,
      useFactory(logger: ILoggerAdapter, eventRepository: IEventRepository) {
          return new OrderConsumerFinishSagaUsecase(logger, eventRepository)
      },
      inject: [ILoggerAdapter, IEventRepository],
    },
  ],
  exports: [IOrderConsumerEndingSagaAdapter]
})
export class ConsumerModule {}
