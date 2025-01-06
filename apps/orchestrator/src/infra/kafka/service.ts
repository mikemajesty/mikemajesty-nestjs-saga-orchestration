import { IKafkaAdapter } from "./adapter";
import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaService implements IKafkaAdapter<Kafka> {
  client: Kafka

  constructor(client: Kafka) {
    this.client = client
  }
}