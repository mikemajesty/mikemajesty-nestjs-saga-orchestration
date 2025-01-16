import { Module } from '@nestjs/common';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { ConsumerModule } from './modules/consumer/module';
import { PaymentModule } from './modules/payment/module';

@Module({
  imports: [SecretsModule, LoggerModule, DatabaseModule, KafkaModule, ProducerModule, ConsumerModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
