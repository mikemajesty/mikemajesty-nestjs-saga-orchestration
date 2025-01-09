import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { OrderModule } from './modules/order/module';
import { ProducerModule } from './infra/producer/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, OrderModule, ProducerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
