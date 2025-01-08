import { IConsumerAdapter } from "./adapter";
import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, Kafka } from "kafkajs";
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
    this.consumer = this.client.consumer({ groupId: this.secret.APPS.ORCHESTRATOR.KAFKA.GROUP })
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.info({ message: `Shutting down [consumer] application with signal: ${signal}` });
    
    await this.consumer.disconnect()
  }

  async connect() {
    await this.consumer.subscribe({ topics: [TopicsEnum.BASE_ORCHESTRATOR, TopicsEnum.START_SAGA] })
  }

  async consume(topic: ConsumerInput, config: ConsumerRunInput) {
    try {
      this.logger.info({ message: `consume connected: ${topic.topics}`})
      this.logger.info({ message: `topic subscribe: ${topic.topics}`})
      await this.consumer.run(config)
      this.logger.info({ message: `consumer run: ${topic.topics}`})
      this.logger.info({ message: `consume message from topics: ${topic.topics}`})
    } catch (error) {
      error.parameters = { topics: topic.topics }
      this.logger.error(error)
    }
  }
}