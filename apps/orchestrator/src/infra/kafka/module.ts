import { Module } from '@nestjs/common';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
          useFactory: (secret: ISecretsAdapter): KafkaOptions => {
            return {
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: secret.APPS.ORCHESTRATOR.KAFKA.CLIENT_ID,
                  brokers: [secret.KAFKA_BROKEN],
                },
                consumer: {
                  groupId: secret.APPS.ORCHESTRATOR.KAFKA.GROUP,
                  readUncommitted: true,
                  retry: {
                    retries: 5,
                  },
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
