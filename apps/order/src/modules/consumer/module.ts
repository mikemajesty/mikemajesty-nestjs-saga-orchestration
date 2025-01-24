import { Module } from '@nestjs/common';

import { IEventRepository } from '@/core/event/repository/event';
import { OrderConsumerFinishSagaUsecase } from '@/core/order/use-cases/order-consumer-ending-saga';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

import { KafkaModule } from '../../infra/kafka/module';
import { EventModule } from '../event/module';
import { IOrderConsumerEndingSagaAdapter } from './adapter';
import { ConsumerController } from './controller';

@Module({
  imports: [LoggerModule, SecretsModule, KafkaModule, EventModule],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IOrderConsumerEndingSagaAdapter,
      useFactory(logger: ILoggerAdapter, eventRepository: IEventRepository) {
        return new OrderConsumerFinishSagaUsecase(logger, eventRepository);
      },
      inject: [ILoggerAdapter, IEventRepository],
    },
  ],
  exports: [IOrderConsumerEndingSagaAdapter],
})
export class ConsumerModule {}
