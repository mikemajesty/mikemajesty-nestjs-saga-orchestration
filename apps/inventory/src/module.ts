import { Module } from '@nestjs/common';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { ConsumerModule } from './consumer/module';

@Module({
  imports: [SecretsModule, LoggerModule, DatabaseModule, KafkaModule, ProducerModule, ConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
