import { Module } from '@nestjs/common';

import { ConsumerController } from './controller';
import { KafkaModule } from '../infra/kafka/module';

@Module({
  imports: [KafkaModule],
  controllers: [ConsumerController],
  providers: [],
})
export class ConsumerModule {}
