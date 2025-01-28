import 'dotenv/config';
import { startTracing } from '@/utils/tracing';
import { name } from '../package.json';

startTracing({ name, version: "1" })


import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { ISecretsAdapter } from '@/infra/secrets';

import { AppModule } from './module';
import { TopicsConsumerEnum } from './utils/topics';
import { bold } from 'colorette';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.ORCHESTRATOR_SERVICE_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKEN],
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: process.env.ORCHESTRATOR_SERVICE_GROUP_ID,
          readUncommitted: true,
          retry: {
            retries: 5,
          },
        },
        producer: {
          allowAutoTopicCreation: true,
        },
        subscribe: {
          fromBeginning: true,
        },
        run: { autoCommit: false },
      },
    },
  );
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication('orchestrator');
  app.useLogger(logger);

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({
    clientId: secret.APPS.ORCHESTRATOR.KAFKA.CLIENT_ID,
    brokers: [secret.KAFKA_BROKEN],
  });

  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: TopicsConsumerEnum.ORCHESTRATOR,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsConsumerEnum.FINISH_FAIL,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsConsumerEnum.FINISH_SUCCESS,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsConsumerEnum.START_SAGA,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
    waitForLeaders: true,
  });
  await admin.disconnect();
  await app.listen();

  logger.log(`⚪ Grafana[${bold('Graphs')}] listening at ${bold(secret.OBSERVABILITY.GRAFANA_URL)}`);
  logger.log(`⚪ Zipkin[${bold('Tracing')}] listening at ${bold(secret.OBSERVABILITY.ZIPKIN_URL)}`);
  logger.log(`⚪ Promethues[${bold('Metrics')}] listening at ${bold(secret.OBSERVABILITY.PROMETHUES_URL)}\n`);
}
bootstrap();
