import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';

import { PaymentSchema } from './schemas/payment';
import { PostgresService } from './service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ({
        APPS: {
          PAYMENT: {
            DATABASE: { URI },
          },
        },
      }: ISecretsAdapter) => {
        const conn = new PostgresService().getConnection({ URI });
        return {
          ...conn,
          timeout: 5000,
          connectTimeout: 5000,
          logging: false,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: true,
          migrationsTableName: 'migrations',
          migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
          entities: [PaymentSchema],
        };
      },
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options as DataSourceOptions);
        return dataSource.initialize();
      },
      imports: [SecretsModule],
      inject: [ISecretsAdapter],
    }),
  ],
})
export class DatabaseModule {}
