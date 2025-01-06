import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, ClientsModule.register([
    {
      name: process.env.ORDER_SERVICE_NAME,
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.ORDER_SERVICE_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: process.env.ORDER_SERVICE_GROUP_ID
        }
      }
    },
  ]),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
