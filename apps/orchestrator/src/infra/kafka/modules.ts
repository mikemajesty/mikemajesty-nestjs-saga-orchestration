import { Module } from '@nestjs/common';

import { KafkaService } from './service';
import { IKafkaAdapter } from './adapter';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { Kafka } from 'kafkajs';
import { TopicsEnum } from '../../utils/topics';

@Module({
  imports: [SecretsModule],
  providers: [
  {
    provide: IKafkaAdapter,
    useFactory: async ({ APPS: { ORCHESTRATOR: { KAFKA: { CLIENT_ID, GROUP } } } }: ISecretsAdapter) => {
      const kafka = new Kafka({ clientId: CLIENT_ID, brokers: ["kafka:29092"] })
      const admin =  kafka.admin()
      await admin.connect()
      await admin.createTopics({ topics: [
        { topic: TopicsEnum.BASE_ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.FINISH_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.FINISH_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.INVENTORY_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.INVENTORY_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.NOTIFY_ENDING, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PAYMENT_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PAYMENT_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.START_SAGA, numPartitions: 1, replicationFactor: 1 },
      ], waitForLeaders: true })
      await admin.disconnect()

      const consumer = kafka.consumer({ groupId: GROUP })
      await consumer.connect()
      
      const service = new KafkaService(kafka)

      return service
    },
    inject: [ISecretsAdapter]
  }],
  exports: [IKafkaAdapter]
})
export class KafkaModule {}
