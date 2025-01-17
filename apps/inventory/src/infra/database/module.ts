 import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';

import { PostgresService } from './service';
import { OrderInventorySchema } from './schemas/order-inventory';
import { InventorySchema } from './schemas/inventory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ({ APPS: { INVENTORY: { DATABASE: { URI } } }, IS_LOCAL }: ISecretsAdapter) => {
        const conn = new PostgresService().getConnection({ URI: URI });
        return {
          ...conn,
          timeout: 5000,
          connectTimeout: 5000,
          logging: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: true,
          migrationsTableName: 'migrations',
          migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
          entities: [InventorySchema, OrderInventorySchema]
        };
      },
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options as DataSourceOptions);
        return dataSource.initialize();
      },
      imports: [SecretsModule],
      inject: [ISecretsAdapter]
    })
  ]
})
export class DatabaseModule {}
