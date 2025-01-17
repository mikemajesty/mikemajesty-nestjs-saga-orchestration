import { KafkaOptions, Transport } from "@nestjs/microservices"

export class KafkaUtils {
  static getKafkaConfig = (input: KafkaIputConfig): KafkaOptions => {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: input.clientId,
          brokers: input.brokers,
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: input.groupId,
          sessionTimeout: 30000,
          readUncommitted: true,
           retry: {
             retries: 5,
             initialRetryTime: 1000,
             maxRetryTime: 5000,
             multiplier: 2
           },
        },
        producer: {
          allowAutoTopicCreation: true,

        },
        subscribe: {
          fromBeginning: true,
        },
        run: { autoCommit: true   }
      },
    }
  }
}

export type KafkaIputConfig = {
  clientId: string
  brokers: string[]
  groupId: string
}