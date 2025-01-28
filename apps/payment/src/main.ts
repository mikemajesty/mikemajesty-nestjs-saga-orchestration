import 'dotenv/config';
import { startTracing } from '@/utils/tracing';
import { name } from '../package.json';

startTracing({ name, version: "1" })

import { NestFactory } from '@nestjs/core';
import { KafkaOptions } from '@nestjs/microservices';
import { bold } from 'colorette';
import { Kafka } from 'kafkajs';

import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { ISecretsAdapter } from '@/infra/secrets';
import { KafkaUtils } from '@/utils/kafka';

import { AppModule } from './module';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(
    AppModule,
    KafkaUtils.getKafkaConfig({
      brokers: [process.env.KAFKA_BROKEN],
      clientId: process.env.PAYMENT_SERVICE_CLIENT_ID,
      groupId: process.env.PAYMENT_SERVICE_GROUP_ID,
    }),
  );

  const {
    APPS: {
      PAYMENT: {
        DATABASE: { URI },
      },
    },
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication('payment');

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({
    clientId: secret.APPS.PAYMENT.KAFKA.CLIENT_ID,
    brokers: [secret.KAFKA_BROKEN],
  });

  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: TopicsConsumerEnum.PAYMENT_FAIL,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsConsumerEnum.PAYMENT_SUCCESS,
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
