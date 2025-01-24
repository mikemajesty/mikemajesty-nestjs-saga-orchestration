import { Module } from '@nestjs/common';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { KafkaUtils } from '@/utils/kafka';

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
            return KafkaUtils.getKafkaConfig({
              brokers: [secret.KAFKA_BROKEN],
              clientId: secret.APPS.PAYMENT.KAFKA.CLIENT_ID,
              groupId: secret.APPS.PAYMENT.KAFKA.GROUP,
            });
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
