import { EventEntity } from '@/entities/event';
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

  async publish(payload: EventEntity): Promise<void> {
    const topic = TopicsProducerEnum.ORCHESTRATOR
    const context = `Payment/${ProducerService.name}`

    this.logger.info({
      message: `message received from: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`, obj: {
        context,
        payload
      }
    })
    try {
      return new Promise((res) => {
        this.client.emit(topic, payload).subscribe({
          error: (error) => {
            res(error)
          },
          complete: () => {
            this.logger.info({
              message: `message sent to topic: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`
            })
            res()
          }
        })
      })
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