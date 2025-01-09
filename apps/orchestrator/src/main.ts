import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { AppModule } from './module';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import { TopicsConsumerEnum } from './utils/topics';
import 'dotenv/config';

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
          allowAutoTopicCreation: false,
          groupId: process.env.ORCHESTRATOR_SERVICE_GROUP_ID,
        },
        producer: {
          allowAutoTopicCreation: false
        }
      },
    },
  );
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication("orchestrator");
  app.useLogger(logger);

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

   const kafka = new Kafka({ clientId: secret.APPS.ORCHESTRATOR.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })

  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
      { topic: TopicsConsumerEnum.ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.FINISH_FAIL, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.FINISH_SUCCESS, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.START_SAGA, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen()
}
bootstrap();
