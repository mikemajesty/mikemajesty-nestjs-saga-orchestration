import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';

import { InventorySchema } from './schemas/inventory';
import { OrderInventorySchema } from './schemas/order-inventory';
import { PostgresService } from './service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ({
        APPS: {
          INVENTORY: {
            DATABASE: { URI },
          },
        },
      }: ISecretsAdapter) => {
        const conn = new PostgresService().getConnection({ URI });
        return {
          ...conn,
          timeout: 5000,
          connectTimeout: 5000,
          logging: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: true,
          entities: [InventorySchema, OrderInventorySchema],
        };
      },
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options as DataSourceOptions);
        const run = await dataSource.initialize();
        return run
      },
      imports: [SecretsModule],
      inject: [ISecretsAdapter],
    }),
  ],
})
export class DatabaseModule {}
