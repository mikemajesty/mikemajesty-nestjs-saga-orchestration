import { MetricsInterceptor } from './../../../middlewares/interceptors/metrics.interceptor';
import { TracingInterceptor } from './../../../middlewares/interceptors/tracing.interceptor';
import { HttpLoggerInterceptor } from './../../../middlewares/interceptors/http-logger.interceptor';
import { ExceptionHandlerInterceptor } from './../../../middlewares/interceptors/exception-handler.interceptor';
import { ExceptionHandlerFilter } from './../../../middlewares/filters/exception-handler.filter';
import { startTracing } from '@/utils/tracing';
import { name } from '../package.json';

startTracing({ name, version: "1" })

import { RequestMethod, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { bold } from 'colorette';
import { NextFunction, Request, Response } from 'express';
import { Kafka } from 'kafkajs';

import { ErrorType, ILoggerAdapter } from '@/infra/logger';
import { ISecretsAdapter } from '@/infra/secrets';

import { AppModule } from './module';
import { TopicsConsumerEnum, TopicsProducerEnum } from './utils/topics';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const {
    APPS: {
      ORDER: { HOST, PORT },
    },
    ENV,
    IS_PRODUCTION,
    OBSERVABILITY: {
      GRAFANA_URL,
      PROMETHUES_URL,
      ZIPKIN_URL
    }
  } = app.get(ISecretsAdapter);
  const logger = app.get(ILoggerAdapter);
  const secret = app.get(ISecretsAdapter);

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [secret.KAFKA_BROKEN],
        clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID,
      },
      consumer: {
        groupId: secret.APPS.ORDER.KAFKA.GROUP,
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
  });

  logger.setApplication('order');
  app.useLogger(logger);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
    ],
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

  app.useGlobalFilters(new ExceptionHandlerFilter(logger));

  app.useGlobalInterceptors(
    new ExceptionHandlerInterceptor(),
    new HttpLoggerInterceptor(logger),
    new TracingInterceptor(logger, name),
    new MetricsInterceptor({ name })
  );


  const kafka = new Kafka({
    clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID,
    brokers: [secret.KAFKA_BROKEN],
  });

  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: TopicsConsumerEnum.NOTIFY_ENDING,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TopicsProducerEnum.START_SAGA,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
    waitForLeaders: true,
  });

  await admin.disconnect();

  const config = new DocumentBuilder()
    .setTitle('order-api')
    .addBearerAuth()
    .setVersion('1.0')
    .addServer(HOST)
    .addTag('Swagger Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await kafkaMicroservice.listen();

  await app.listen(PORT, () => {
    logger.log(
      `🟢 ${'order'} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢`,
    );
    if (!IS_PRODUCTION)
      logger.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢`);

    logger.log(`⚪ Grafana[${bold('Graphs')}] listening at ${bold(GRAFANA_URL)}`);
    logger.log(`⚪ Zipkin[${bold('Tracing')}] listening at ${bold(ZIPKIN_URL)}`);
    logger.log(`⚪ Promethues[${bold('Metrics')}] listening at ${bold(PROMETHUES_URL)}\n`);

  });
}
bootstrap();
