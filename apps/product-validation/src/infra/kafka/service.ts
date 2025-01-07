import { IKafkaAdapter } from "./adapter";
import { Injectable } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
import { TopicsEnum } from "../../utils/topics";
import { ISecretsAdapter } from "@/infra/secrets";
import { Event } from "../../order/entity/event";
import { ILoggerAdapter } from "@/infra/logger";

@Injectable()
export class KafkaService implements IKafkaAdapter<Kafka> {
  client: Kafka

  producer: Producer

  consumer: Consumer

  constructor(client: Kafka, private readonly secret: ISecretsAdapter, private readonly logger: ILoggerAdapter) {
    this.client = client
    this.producer = this.client.producer()
    this.consumer = this.client.consumer({ groupId: this.secret.APPS.PRODUCT_VALIDATOR.KAFKA.GROUP })
  }

  async connect() {
    const admin =  this.client.admin()
      await admin.connect()

      await admin.createTopics({ topics: [
        { topic: TopicsEnum.ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_SUCCESS, numPartitions: 1, replicationFactor: 1 },
      ], waitForLeaders: true })
      await admin.disconnect()
      await this.consumer.connect()
      await this.producer.connect()
  }

  async sendEvent(event: Event): Promise<void> {
    try {
      await this.producer.send({
        topic: TopicsEnum.ORCHESTRATOR,
        messages: [{ value: JSON.stringify(event)  }]
      })
      this.logger.info({ message: `sending to topic: ${TopicsEnum.ORCHESTRATOR}`, obj: { payload: event } })
    } catch (error) {
      error.parameters = { payload: event, topic: TopicsEnum.ORCHESTRATOR }
      this.logger.error(error)
    }
  }
}