import { SagaSourceEnum, SagaStatusEnum } from "./event";

export class Historic {
  source!: SagaSourceEnum;

  status!: SagaStatusEnum;

  message!: string;

  constructor(entity: object) {
    Object.assign(this, entity);
  }
}