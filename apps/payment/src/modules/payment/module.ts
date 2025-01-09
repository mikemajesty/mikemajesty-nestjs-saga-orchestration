import { Module } from '@nestjs/common';

import { PaymentController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';

@Module({
  imports: [KafkaModule],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentConsumerModule {}
