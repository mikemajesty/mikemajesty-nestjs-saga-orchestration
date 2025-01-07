import { Module } from '@nestjs/common';

import { KafkaService } from './service';
import { IKafkaAdapter } from './adapter';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { Kafka } from 'kafkajs';
import { TopicsEnum } from '../../utils/topics';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

@Module({
  imports: [SecretsModule, LoggerModule],
  providers: [
  {
    provide: IKafkaAdapter,
    useFactory: async (secret: ISecretsAdapter, logger: ILoggerAdapter) => {
      const kafka = new Kafka({ clientId: secret.APPS.ORCHESTRATOR.KAFKA.CLIENT_ID, brokers: ["kafka:29092"] })
      
      const service = new KafkaService(kafka, secret, logger)

      await service.connect()
      
      return service
    },
    inject: [ISecretsAdapter, ILoggerAdapter]
  }],
  exports: [IKafkaAdapter]
})
export class KafkaModule {}
