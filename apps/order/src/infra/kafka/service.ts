import { IKafkaAdapter } from "./adapter";
import { Injectable } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
import { TopicsEnum } from "../../utils/topics";
import { ISecretsAdapter } from "@/infra/secrets";
import { EventEntity } from "../../core/order/entity/event";
import { ILoggerAdapter } from "@/infra/logger";

@Injectable()
export class KafkaService implements IKafkaAdapter<Kafka> {
  client: Kafka

  producer: Producer

  consumer: Consumer

  constructor(client: Kafka, private readonly secret: ISecretsAdapter, private readonly logger: ILoggerAdapter) {
    this.client = client
    this.producer = this.client.producer()
    this.consumer = this.client.consumer({ groupId: this.secret.APPS.ORDER.KAFKA.GROUP })
  }

  async connect() {
    const admin =  this.client.admin()
    await admin.connect()
    await admin.createTopics({ topics: [
      { topic: TopicsEnum.START_SAGA, numPartitions: 1, replicationFactor: 1 },
      { topic: TopicsEnum.NOTIFY_ENDING, numPartitions: 1, replicationFactor: 1 },
    ], waitForLeaders: true })
    await admin.disconnect()
    await this.consumer.connect()
    await this.producer.connect()
  }

  async sendEvent(event: EventEntity): Promise<void> {
    try {
      await this.producer.send({
        topic: TopicsEnum.START_SAGA,
        messages: [{ value: JSON.stringify(event)  }]
      })
      this.logger.info({ message: `sending to topic: ${TopicsEnum.START_SAGA}`, obj: { payload: event } })
    } catch (error) {
      error.parameters = { payload: event, topic: TopicsEnum.START_SAGA }
      this.logger.error(error)
    }
  }
}