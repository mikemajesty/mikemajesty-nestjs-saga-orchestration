import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TopicsEnum } from './utils/topics';
import { Kafka } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useLogger(logger);

  app.setGlobalPrefix('api/payment', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET }
    ]
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
    next();
  });

  app.enableVersioning({ type: VersioningType.URI });

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
      { topic: TopicsEnum.ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsEnum.PAYMENT_FAIL, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsEnum.PAYMENT_SUCCESS, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen(PORT, () => {
    logger.log(`🟢 ${"payment"} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢`);
    if (!IS_PRODUCTION) logger.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢`);
  });

  logger.log(`🔵 Postgres listening at ${bold(URI)}`);
}
bootstrap();
