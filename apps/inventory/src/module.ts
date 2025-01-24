import { Module } from '@nestjs/common';

import { LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

import { DatabaseModule } from './infra/database';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { ConsumerModule } from './modules/consumer/module';
import { InventoryModule } from './modules/inventory/module';
import { OrderInventoryModule } from './modules/order-inventory/module';

@Module({
  imports: [
    SecretsModule,
    LoggerModule,
    DatabaseModule,
    KafkaModule,
    ProducerModule,
    ConsumerModule,
    InventoryModule,
    OrderInventoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
