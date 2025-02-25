import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PaymentSchema } from './schemas/payment';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'admin',
  password: 'admin',
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  database: 'payment-db',
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  entities: [PaymentSchema],
});

export default dataSource;
