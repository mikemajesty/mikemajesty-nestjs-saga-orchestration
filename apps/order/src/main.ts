import { RequestMethod, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { bold } from 'colorette';
import { NextFunction, Request, Response } from 'express';

import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { ISecretsAdapter } from '@/infra/secrets';
import { AppModule } from './module';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Kafka, KafkaConfig } from 'kafkajs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventEntity } from './core/event/entity/event';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true
  });

  const {
    APPS: {
      ORDER: { HOST, PORT }
    },
    ENV,
    IS_PRODUCTION,
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [secret.KAFKA_BROKEN],
        clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID
      },
      consumer: {
        groupId: secret.APPS.ORDER.KAFKA.GROUP
      }
    }
  })


  logger.setApplication("order");
  app.useLogger(logger);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET }
    ]
  });

  new EventEntity({"id":"8af5054c-de61-4f5a-bd55-9f0511e48377","transactionId":"1736547495481_018068bb-f881-48d1-b5aa-eabb2f83e3a3","eventHistoric":[],"orderId":"c62f94f2-5774-4b15-98b7-b647275410ca","payload":{"id":"c62f94f2-5774-4b15-98b7-b647275410ca","products":[{"product":{"code":"COMIC_BOOKS","unitValue":15.5},"quantity":3},{"product":{"code":"BOOKS","unitValue":9.9},"quantity":1}],"transactionId":"1736547495481_018068bb-f881-48d1-b5aa-eabb2f83e3a3","createdAt":"2025-01-10T22:18:15.481Z"},"createdAt":"2025-01-10T22:18:15.485Z","updatedAt":"2025-01-10T22:18:15.485Z","deletedAt":null})

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

  const kafka = new Kafka({ clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID, brokers: [secret.KAFKA_BROKEN] })

  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
      { topic: TopicsConsumerEnum.NOTIFY_ENDING, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsProducerEnum.START_SAGA, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true
  })

  await admin.disconnect()

  const config = new DocumentBuilder()
    .setTitle("order-api")
    .addBearerAuth()
    .setVersion("1.0")
    .addServer(HOST)
    .addTag('Swagger Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await kafkaMicroservice.listen()

  await app.listen(PORT, () => {
    logger.log(`🟢 ${"order"} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢`);
    if (!IS_PRODUCTION) logger.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢`);
  });
}
bootstrap();
