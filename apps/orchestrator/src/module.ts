import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { ConsumerModule } from './infra/consumer/modules';
import { ProducerModule } from './infra/producer/modules';
import { ConsumeModule } from './modules/consume/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, ConsumerModule, ProducerModule, ConsumeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
