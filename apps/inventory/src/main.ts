import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { bold } from 'colorette';
import { Kafka } from 'kafkajs';

import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { ISecretsAdapter } from '@/infra/secrets';

import { AppModule } from './module';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.INVENTORY_SERVICE_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKEN],
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: process.env.INVENTORY_SERVICE_GROUP_ID,
          readUncommitted: true,
          retry: {
            retries: 5,
          },
        },
        subscribe: {
          fromBeginning: true,
        },
        producer: {
          allowAutoTopicCreation: true,
        },
        run: { autoCommit: false },
      },
    },
  );

  const {
    APPS: {
      INVENTORY: {
        DATABASE: { URI },
      },
    },
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication('inventory');
  app.useLogger(logger);

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({
    clientId: secret.APPS.INVENTORY.KAFKA.CLIENT_ID,
    brokers: [secret.KAFKA_BROKEN],
  });
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: TopicsConsumerEnum.INVENTORY_SUCCESS,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsConsumerEnum.INVENTORY_FAIL,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsProducerEnum.ORCHESTRATOR,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
    waitForLeaders: true,
  });
  await admin.disconnect();

  await app.listen();

  logger.log(`🔵 Postgres listening at ${bold(URI)}`);
}
bootstrap();
