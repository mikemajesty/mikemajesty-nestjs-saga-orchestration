import { ClientKafka } from '@nestjs/microservices';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { Module } from '@nestjs/common';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { IKafkaAdapter } from './adapter';
import { KafkaService } from './service';


@Module({
  imports: [
    SecretsModule,
    ClientsModule.registerAsync({
      clients: [{
        imports: [SecretsModule],
        useFactory: (secret: ISecretsAdapter): ClientProvider => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: secret.APPS.PAYMENT.KAFKA.CLIENT_ID,
                brokers: [secret.KAFKA_BROKEN],
              },
              consumer: {
                groupId: secret.APPS.PAYMENT.KAFKA.GROUP,
              },
            },
          };
        },
        inject: [ISecretsAdapter],
        name: IKafkaAdapter.name
      }],
    })
  ],
  providers: [{
    provide: IKafkaAdapter,
    useFactory(kafka: ClientKafka) {
      return new KafkaService(kafka)
    },
    inject: [{ token: IKafkaAdapter.name, optional: false }]
  }],
  exports: [IKafkaAdapter]
})
export class KafkaModule { }
