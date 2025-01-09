import { Module } from '@nestjs/common';

import { ConsumerController } from './controller';
import { IOrderConsumerEndingSagaAdapter } from './adapter';
import { OrderProducerCreateUsecase } from '@/core/order/use-cases/order-producer-create';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { KafkaModule } from '../../infra/kafka/module';
import { IKafkaAdapter } from '../../infra/kafka/adapter';
import { OrderConsumerFinishSagaUsecase } from '@/core/order/use-cases/order-consumer-ending-saga';
@Module({
  imports: [LoggerModule, SecretsModule, KafkaModule],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IOrderConsumerEndingSagaAdapter,
      useFactory(logger: ILoggerAdapter) {
          return new OrderConsumerFinishSagaUsecase(logger)
      },
      inject: [ILoggerAdapter],
    },
  ],
  exports: [IOrderConsumerEndingSagaAdapter]
})
export class ConsumerModule {}
