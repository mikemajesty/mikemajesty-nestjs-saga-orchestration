import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { red } from 'colorette';
import { Connection } from 'mongoose';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { ApiInternalServerException } from '@/utils/exception';

import { ConnectionName } from './enum';
import { MongoService } from './service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: ConnectionName.ORDER,
      useFactory: ({ APPS: { ORDER: { DATABASE: { URI } } } }: ISecretsAdapter, logger: ILoggerAdapter) => {
        const connection = new MongoService().getConnection({ URI: URI });
        return {
          connectionFactory: (connection: Connection) => {
            if (connection.readyState === 1) {
              logger.log('🎯 mongo connected successfully!');
            }
            connection.on('disconnected', () => {
              logger.fatal(new ApiInternalServerException('mongo disconnected!'));
            });
            connection.on('reconnected', () => {
              logger.log(red('mongo reconnected!\n'));
            });
            connection.on('error', (error) => {
              logger.fatal(new ApiInternalServerException(error.message || error, { context: 'MongoConnection' }));
            });

            return connection;
          },
          uri: connection.uri,
          appName: "order"
        };
      },
      inject: [ISecretsAdapter, ILoggerAdapter],
      imports: [SecretsModule, LoggerModule]
    })
  ]
})
export class DatabaseModule {}
