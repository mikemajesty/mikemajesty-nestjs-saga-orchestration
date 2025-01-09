import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { Kafka } from 'kafkajs';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
async function bootstrap() {
 
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.PRODUCT_VALIDATOR_SERVICE_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKEN],
        },
        consumer: {
          allowAutoTopicCreation: false,
          groupId: process.env.PRODUCT_VALIDATOR_SERVICE_GROUP_ID,
        },
        producer: {
          allowAutoTopicCreation: false
        }
      },
      
    },
  );

  const {
    APPS: {
      PRODUCT_VALIDATOR: { HOST, PORT, DATABASE: { URI } }
    },
    ENV,
    IS_PRODUCTION,
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication("product-validation");
  app.useLogger(logger);

  process.on('uncaughtException', (error) => {
    logger.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(error as ErrorType);
  });

  const kafka = new Kafka({ clientId: secret.APPS.PRODUCT_VALIDATOR.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })
  const admin = kafka.admin()
  await admin.connect()

  await admin.createTopics({
    topics: [
      { topic: TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen();

  logger.log(`🔵 Postgres listening at ${bold(URI)}`);
}
bootstrap();
