import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IProducerAdapter } from "./adapter";
import { TopicsProducerEnum } from "../../utils/topics";
import { Injectable } from "@nestjs/common";
import { IKafkaAdapter } from "../kafka/adapter";
import { ILoggerAdapter } from "@/infra/logger";
import { Observable } from "rxjs";

@Injectable()
export class ProducerService implements IProducerAdapter {
  client: ClientKafka;

  constructor(kafka: IKafkaAdapter, private readonly logger: ILoggerAdapter) {
    this.client = kafka.client
  }

  publish(payload: string): Observable<any> {
    const topic =  TopicsProducerEnum.ORCHESTRATOR
    const context = `ProductValidation/${ProducerService.name}`
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
        topic: topic,
        context,
        payload
      }
      this.logger.error(error)
    }
  }
}