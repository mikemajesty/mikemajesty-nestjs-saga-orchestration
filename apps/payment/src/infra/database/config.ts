import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();


const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PRODUCT_POSTGRES_HOST,
  port: Number(process.env.PRODUCT_POSTGRES_PORT),
  username: process.env.PRODUCT_POSTGRES_USER,
  password: process.env.PRODUCT_POSTGRES_PASSWORD,
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  database: process.env.PRODUCT_POSTGRES_DATABASE,
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  entities: [path.join(__dirname, '/schemas/*.{ts,js}')]
});

export default dataSource;
