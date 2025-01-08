import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import 'dotenv/config';
import { ConsumerModule } from './infra/consumer/modules';
import { ProducerModule } from './infra/producer/modules';
import { OrderModule } from './modules/order/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, ConsumerModule, ProducerModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
