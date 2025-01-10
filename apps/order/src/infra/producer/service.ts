import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IProducerAdapter } from "./adapter";
import { TopicsProducerEnum } from "../../utils/topics";
import { Injectable } from "@nestjs/common";
import { IKafkaAdapter } from "../kafka/adapter";
import { ILoggerAdapter } from "@/infra/logger";
import { Observable } from "rxjs";
import { EventEntity } from "@/core/event/entity/event";

@Injectable()
export class ProducerService implements IProducerAdapter {
  client: ClientKafka;

  constructor(kafka: IKafkaAdapter, private readonly logger: ILoggerAdapter) {
    this.client = kafka.client
  }

  publish(topic: TopicsProducerEnum, payload: EventEntity): Observable<any> {
    const context = `Order/${ProducerService.name}`
    try {
      this.logger.info({
        message: `message received from: ${topic}`, obj: {
          context,
          payload
        }
      })
      return this.client.send(topic, JSON.stringify(payload))
    } catch (error) {
      error.parameters = {
        topic: topic,
        context,
        payload
      }
      this.logger.error(error)
    }
  }
}