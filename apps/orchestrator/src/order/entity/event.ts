import { Order } from './order';
import { Historic } from './historic';

export enum SagaStatusEnum {
  SUCCESS="success",
  ROLLBACK_PENDING="rollback_pending",
  FAIL="fail",
}

export enum SagaSourceEnum {
  ORCHESTRATOR="orchestrator",
  PRODUCT_VALIDATION_SERVICE="product-validation-service",
  PAYMENT_SERVICE="payment-service",
  INVENTORY_SERVICE="inventory-service",
}

export class Event {
  id: string

  transactionId: string

  orderId: string

  payload: Order

  source: SagaSourceEnum

  status: SagaStatusEnum

  eventHistoric: Historic[]

  constructor(entity: Event) {
    Object.assign(this, entity);
  }
}