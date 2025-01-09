import { NestFactory } from '@nestjs/core';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { AppModule } from './module';
import { Kafka } from 'kafkajs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { TopicsConsumerEnum } from './utils/topics';

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
          groupId: process.env.INVENTORY_SERVICE_GROUP_ID,
        },
      },
    },
  );

  const {
    APPS: {
      INVENTORY: { HOST, PORT, DATABASE: { URI } }
    },
    ENV,
    IS_PRODUCTION,
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication("inventory");
  app.useLogger(logger);

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({ clientId: secret.APPS.INVENTORY.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })
  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
      { topic: TopicsConsumerEnum.INVENTORY_SUCCESS, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.INVENTORY_FAIL, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen();

  logger.log(`🔵 Postgres listening at ${bold(URI)}`);
}
bootstrap();
