import { IProducerAdapter } from "./adapter";
import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord, CompressionTypes, CompressionCodecs } from "kafkajs";
import * as SnappyCodec from "kafkajs-snappy";
import { ILoggerAdapter } from "@/infra/logger";
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

@Injectable()
export class ProducerService implements IProducerAdapter<Kafka>, OnModuleInit, OnApplicationShutdown {
  client: Kafka

  private producer: Producer

  constructor(client: Kafka, private readonly logger: ILoggerAdapter) {
    this.client = client
    this.producer = this.client.producer()
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.info({ message: `Shutting down [producer] application with signal: ${signal}` });
    await this.producer.disconnect();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.info({ message: "Kafka [producer] connected" });
  }

  async publish(message: ProducerRecord): Promise<void> {
    try {
      const response = await this.producer.send(message)
      this.logger.info({ message: `sending message to topic: ${message.topic}`, obj: { response, payload: message.messages } })
    } catch (error) {
      error.parameters = { payload: message, topic: message.topic }
      this.logger.error(error)
    }
  }
}