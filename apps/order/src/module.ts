import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { NotifyEndingInfraModule } from './infra/consumers/modules';
import { ProducerModule } from './infra/producer/modules';
import { OrderModule } from './modules/order/module';
import { NotifyEndingModule } from './modules/consumers/notify-ending';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, NotifyEndingInfraModule, ProducerModule, OrderModule, NotifyEndingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
