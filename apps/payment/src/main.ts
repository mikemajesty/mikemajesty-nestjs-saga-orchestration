import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import { KafkaOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';
import { KafkaUtils } from '@/utils/kafka';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(
    AppModule,
    KafkaUtils.getKafkaConfig({ brokers: [process.env.KAFKA_BROKEN], clientId: process.env.PAYMENT_SERVICE_CLIENT_ID, groupId: process.env.PAYMENT_SERVICE_GROUP_ID }),
  );

  const {
    APPS: {
      PAYMENT: { HOST, PORT, DATABASE: { URI } }
    },
    ENV,
    IS_PRODUCTION,
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication("payment");

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({ clientId: secret.APPS.PAYMENT.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })

  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
      { topic: TopicsConsumerEnum.PAYMENT_FAIL, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.PAYMENT_SUCCESS, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsProducerEnum.ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen();

  logger.log(`🔵 Postgres listening at ${bold(URI)}`);
}
bootstrap();
