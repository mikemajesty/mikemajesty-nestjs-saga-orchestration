import 'dotenv/config';

import { green } from 'colorette';
import { mongoMigrateCli } from 'mongo-migrate-ts';
import path from 'path';

console.log(
  green(`ENV: ${process.env['NODE_ENV']} mongo migration running.\n`),
);

mongoMigrateCli({
  uri: process.env.MONGO_URL,
  database: process.env.ORDER_MONGO_DATABASE,
  migrationsDir: path.join(__dirname, './migrations'),
  migrationsCollection: 'migrations',
});
