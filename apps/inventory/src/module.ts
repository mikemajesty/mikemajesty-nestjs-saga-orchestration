import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';
import { ProducerModule } from './infra/producer/modules';
import { ConsumerModule } from './infra/consumer/modules';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, ProducerModule, ConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
