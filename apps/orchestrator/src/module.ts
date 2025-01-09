import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, KafkaModule, ProducerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
