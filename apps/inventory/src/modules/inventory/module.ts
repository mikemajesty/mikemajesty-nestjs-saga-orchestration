import { Module } from '@nestjs/common';

import { InventoryController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';

@Module({
  imports: [KafkaModule],
  controllers: [InventoryController],
  providers: [],
})
export class InventoryConsumerModule {}
