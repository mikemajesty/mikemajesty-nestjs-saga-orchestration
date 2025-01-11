import { Module } from '@nestjs/common';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { ConsumerModule } from './modules/consumer/module';
import { ProductValidationModule } from './modules/validation/module';
import { ProductModule } from './modules/product/module';

@Module({
  imports: [SecretsModule, LoggerModule, DatabaseModule, KafkaModule, ProducerModule, ConsumerModule, ProductValidationModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
