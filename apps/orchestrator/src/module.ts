import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { KafkaModule } from './infra/kafka/modules';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
