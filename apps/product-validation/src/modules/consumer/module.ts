import { Module } from '@nestjs/common';

import { ConsumerController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';
import { ProductModule } from '../product/module';
import { ProductValidationModule } from '../validation/module';

@Module({
  imports: [KafkaModule, ProductModule, ProductValidationModule],
  controllers: [ConsumerController],
  providers: [],
})
export class ConsumerModule {}
