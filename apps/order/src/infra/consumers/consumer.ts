import { IConsumerAdapter } from "./adapter";
import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";
import { ISecretsAdapter } from "@/infra/secrets";
import { ILoggerAdapter } from "@/infra/logger";
import { ConsumerInput, ConsumerRunInput } from "../../utils/types";
import { TopicsEnum } from "../../utils/topics";

@Injectable()
export class ConsumerService implements IConsumerAdapter<Kafka>, OnApplicationShutdown {
  client: Kafka

  private consumer: Consumer

  constructor(client: Kafka, private readonly secret: ISecretsAdapter, private readonly logger: ILoggerAdapter) {
    this.client = client
    this.consumer = this.client.consumer({ groupId: this.secret.APPS.ORDER.KAFKA.GROUP })
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.info({ message: `Shutting down [consumer] application with signal: ${signal}` });
    
    await this.consumer.disconnect()
  }

  async connect(){
    await this.consumer.subscribe({ topic: TopicsEnum.NOTIFY_ENDING })
  }

  async notifyEnding(config: ConsumerRunInput) {
    try {
      this.logger.info({ message: `consume connected: ${TopicsEnum.NOTIFY_ENDING}`})
      await this.consumer.run(config)
    } catch (error) {
      error.parameters = { topics: TopicsEnum.NOTIFY_ENDING }
      this.logger.error(error)
    }
  }
}