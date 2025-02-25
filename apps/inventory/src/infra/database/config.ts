import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { InventorySchema } from './schemas/inventory';
import { OrderInventorySchema } from './schemas/order-inventory';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'admin',
  password: 'admin',
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  database: 'inventory-db',
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  entities: [InventorySchema, OrderInventorySchema],
});

export default dataSource;
