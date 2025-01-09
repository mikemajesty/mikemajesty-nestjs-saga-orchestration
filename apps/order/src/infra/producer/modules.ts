import { Module } from '@nestjs/common';

import { ProducerService } from './producer';
import { IProducerAdapter } from './adapter';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { Kafka } from 'kafkajs';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { TopicsEnum } from '../../utils/topics';

@Module({
  imports: [SecretsModule, LoggerModule],
  providers: [
    {
      provide: IProducerAdapter,
      useFactory: async (secret: ISecretsAdapter, logger: ILoggerAdapter) => {
        const kafka = new Kafka({ clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })
        
        const service = new ProducerService(kafka, logger)
        return service
      },
      inject: [ISecretsAdapter, ILoggerAdapter]
    }],
  exports: [IProducerAdapter]
})
export class ProducerModule { }
