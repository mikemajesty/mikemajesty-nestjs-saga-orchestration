import { IConsumerAdapter } from "./adapter";
import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";
import { ISecretsAdapter } from "@/infra/secrets";
import { ILoggerAdapter } from "@/infra/logger";

@Injectable()
export class ConsumerService implements IConsumerAdapter<Kafka>, OnApplicationShutdown {
  client: Kafka

  private consumers: Consumer[] = []

  constructor(client: Kafka, private readonly secret: ISecretsAdapter, private readonly logger: ILoggerAdapter) {
    this.client = client
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.info({ message: `Shutting down [consumer] application with signal: ${signal}` });
    
    await Promise.all(this.consumers.map(c => {
      return c.disconnect()
    }))
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    try {
      const consumer = this.client.consumer({ groupId: this.secret.APPS.PAYMENT.KAFKA.GROUP })
      await consumer.connect()
      this.logger.info({ message: `consume connected: ${topic.topics}`})
      await consumer.subscribe(topic)
      await consumer.run(config)
      this.consumers.push(consumer)
      this.logger.info({ message: `consume message from topics: ${topic.topics}`})
    } catch (error) {
      error.parameters = { topics: topic.topics }
      this.logger.error(error)
    }
  }
}