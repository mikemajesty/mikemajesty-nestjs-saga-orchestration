import { Module } from '@nestjs/common';

import { ConsumerService } from './consumer';
import { IConsumerAdapter } from './adapter';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { Kafka } from 'kafkajs';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

@Module({
  imports: [SecretsModule, LoggerModule],
  providers: [
    {
      provide: IConsumerAdapter,
      useFactory: async (secret: ISecretsAdapter, logger: ILoggerAdapter) => {
        const kafka = new Kafka({ clientId: secret.APPS.INVENTORY.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })
        
        const service = new ConsumerService(kafka, secret, logger)

        return service
      },
      inject: [ISecretsAdapter, ILoggerAdapter]
    }],
  exports: [IConsumerAdapter]
})
export class ConsumerModule { }