import { Module } from '@nestjs/common';

import { LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

import { DatabaseModule } from './infra/databse';
import { ProducerModule } from './infra/producer/module';
import { ConsumerModule } from './modules/consumer/module';
import { EventModule } from './modules/event/module';
import { HealthModule } from './modules/health/module';
import { OrderModule } from './modules/order/module';

@Module({
  imports: [
    HealthModule,
    SecretsModule,
    LoggerModule,
    DatabaseModule,
    OrderModule,
    ProducerModule,
    ConsumerModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
