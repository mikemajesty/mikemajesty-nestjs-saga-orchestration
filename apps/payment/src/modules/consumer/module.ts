import { Module } from '@nestjs/common';

import { ConsumerController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';
import { PaymentModule } from '../payment/module';

@Module({
  imports: [KafkaModule, PaymentModule],
  controllers: [ConsumerController],
  providers: [],
})
export class ConsumerModule {}
