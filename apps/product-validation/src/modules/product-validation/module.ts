import { Module } from '@nestjs/common';

import { ProductValidationController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';

@Module({
  imports: [KafkaModule],
  controllers: [ProductValidationController],
  providers: [],
})
export class ProductValidationConsumerModule {}
