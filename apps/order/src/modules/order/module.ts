import { Module } from '@nestjs/common';

import { OrderController } from './controller';
import { IOrderCreateAdapter } from './adapter';
import { OrderCreateUsecase } from '@/core/order/use-cases/order-create';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { KafkaModule } from '../../infra/kafka/module';
import { IKafkaAdapter } from '../../infra/kafka/adapter';
@Module({
  imports: [LoggerModule, SecretsModule, KafkaModule],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderCreateAdapter,
      useFactory(kafka: IKafkaAdapter, logger: ILoggerAdapter) {
          return new OrderCreateUsecase(kafka, logger)
      },
      inject: [IKafkaAdapter, ILoggerAdapter]
    },
  ],
  exports: [IOrderCreateAdapter]
})
export class OrderModule {}
