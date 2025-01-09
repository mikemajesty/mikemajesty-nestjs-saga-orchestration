import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { NotifyEndingModule } from './infra/consumers/modules';
import { ProducerModule } from './infra/producer/modules';
import { OrderModule } from './modules/order/module';
import { ConsumeModule } from './modules/consumers/notify-ending';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, NotifyEndingModule, ProducerModule, OrderModule, ConsumeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
