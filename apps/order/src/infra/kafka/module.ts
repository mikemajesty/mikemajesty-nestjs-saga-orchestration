import { Module } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';

import { IKafkaAdapter } from './adapter';
import { KafkaService } from './service';

@Module({
  imports: [
    SecretsModule,
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [SecretsModule],
          useFactory: (secret: ISecretsAdapter): ClientProvider => {
            return {
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: secret.APPS.ORDER.KAFKA.CLIENT_ID,
                  brokers: [secret.KAFKA_BROKEN],
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
            };
          },
          inject: [ISecretsAdapter],
          name: IKafkaAdapter.name,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: IKafkaAdapter,
      useFactory(kafka: ClientKafka) {
        return new KafkaService(kafka);
      },
      inject: [{ token: IKafkaAdapter.name, optional: false }],
    },
  ],
  exports: [IKafkaAdapter],
})
export class KafkaModule {}
