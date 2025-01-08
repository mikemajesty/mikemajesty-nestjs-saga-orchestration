import { NestFactory } from '@nestjs/core';
import { ISecretsAdapter } from '@/infra/secrets';
import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { bold } from 'colorette';
import { AppModule } from './module';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import { TopicsEnum } from './utils/topics';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {
    APPS: {
      ORCHESTRATOR: { HOST, PORT }
    },
    ENV,
    IS_PRODUCTION,
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  logger.setApplication("orchestrator");
  app.useLogger(logger);

  app.setGlobalPrefix('api/orchestrator', {
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

  const kafka = new Kafka({ clientId: secret.APPS.ORCHESTRATOR.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })

  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
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
    ], waitForLeaders: true
  })
  await admin.disconnect()

  await app.listen(PORT, () => {
    logger.log(`🟢 ${"orchestrator"} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢`);
    if (!IS_PRODUCTION) logger.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢`);
  });
}
bootstrap();
