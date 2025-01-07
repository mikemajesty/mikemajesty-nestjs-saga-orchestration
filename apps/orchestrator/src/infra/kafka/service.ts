import { ISecretsAdapter } from "@/infra/secrets";
import { IKafkaAdapter } from "./adapter";
import { Injectable } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
import { ILoggerAdapter } from "@/infra/logger";
import { TopicsEnum } from "../../utils/topics";

@Injectable()
export class KafkaService implements IKafkaAdapter<Kafka> {
  client: Kafka

  producer: Producer

  consumer: Consumer

  constructor(client: Kafka, private readonly secret: ISecretsAdapter, private readonly logger: ILoggerAdapter) {
    this.client = client
    this.producer = this.client.producer()
    this.consumer = this.client.consumer({ groupId: this.secret.APPS.ORCHESTRATOR.KAFKA.GROUP })
  }

  async sendEvent(event: object, topic: string): Promise<void> {
    try {
      await this.producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(event)  }]
      })
      this.logger.info({ message: `sending to topic: ${topic}`, obj: { payload: event } })
    } catch (error) {
      error.parameters = { payload: event, topic: topic }
      this.logger.error(error)
    }
  }

  async connect() {
    const admin =  this.client.admin()
      await admin.connect()
      await admin.createTopics({ topics: [
        { topic: TopicsEnum.BASE_ORCHESTRATOR, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.FINISH_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.FINISH_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.INVENTORY_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.INVENTORY_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.NOTIFY_ENDING, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PAYMENT_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PAYMENT_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_FAIL, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.PRODUCT_VALIDATION_SUCCESS, numPartitions: 1, replicationFactor: 1 },
        { topic: TopicsEnum.START_SAGA, numPartitions: 1, replicationFactor: 1 },
      ], waitForLeaders: true })
      await admin.disconnect()
      await this.consumer.connect()
      await this.producer.connect()
  }
}