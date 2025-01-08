import { Order } from './order';
import { Historic } from './historic';

export enum SagaStatusEnum {
  SUCCESS="success",
  ROLLBACK_PENDING="rollback_pending",
  FAIL="fail",
}

export class Event {
  id: string

  transactionId: string

  orderId: string

  payload: Order

  source: string

  status: SagaStatusEnum

  eventHistoric: Historic[]

  constructor(entity: Event) {
    Object.assign(this, entity);
  }
}