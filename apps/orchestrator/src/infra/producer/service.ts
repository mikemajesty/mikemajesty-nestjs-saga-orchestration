import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IProducerAdapter } from "./adapter";
import { TopicsEnum } from "../../utils/topics";
import { Observable } from "rxjs";
import { Injectable } from "@nestjs/common";
import { IKafkaAdapter } from "../kafka/adapter";
import { ILoggerAdapter } from "@/infra/logger";

@Injectable()
export class ProducerService implements IProducerAdapter {
  client: ClientKafka;

  constructor(kafka: IKafkaAdapter, private readonly logger: ILoggerAdapter) {
    this.client = kafka.client
  }
  
  publish(topic: TopicsEnum, payload: string) {
    const context = `Orchestrator/${ProducerService.name}`
    try {
      this.logger.info({
        message: `message received from: ${topic}`, obj: {
          context,
          payload
        }
      })
      return this.client.send(topic, payload)
    } catch (error) {
      error.parameters = {
        topic,
        context,
        payload
      }
      this.logger.error(error)
    }
  }
}