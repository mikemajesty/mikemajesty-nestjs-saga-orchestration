import { Module } from '@nestjs/common';

import { LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

import { ConsumerModule } from './consumer/module';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { SagaLibModule } from './libs/saga/modules';

@Module({
  imports: [
    SecretsModule,
    LoggerModule,
    KafkaModule,
    ProducerModule,
    ConsumerModule,
    SagaLibModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
