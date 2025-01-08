import {  SagaStatusEnum } from "./event";

export class Historic {
  source!: string;

  status!: SagaStatusEnum;

  message!: string;

  constructor(entity: object) {
    Object.assign(this, entity);
  }
}