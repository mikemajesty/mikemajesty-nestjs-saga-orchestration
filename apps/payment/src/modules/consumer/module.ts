import { Module } from '@nestjs/common';

import { KafkaModule } from '../../infra/kafka/module';
import { PaymentModule } from '../payment/module';
import { ConsumerController } from './controller';

@Module({
  imports: [KafkaModule, PaymentModule],
  controllers: [ConsumerController],
  providers: [],
})
export class ConsumerModule {}
