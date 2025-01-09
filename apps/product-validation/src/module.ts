import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { ProductValidationConsumerModule } from './modules/product-validation/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, KafkaModule, ProducerModule, ProductValidationConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
