export enum TopicsProducerEnum {
  PRODUCT_VALIDATION_SUCCESS = 'product-validation-success',
  PRODUCT_VALIDATION_FAIL = 'product-validation-fail',
  INVENTORY_SUCCESS = 'inventory-success',
  INVENTORY_FAIL = 'inventory-fail',
  PAYMENT_SUCCESS = 'payment-success',
  PAYMENT_FAIL = 'payment-fail',
  NOTIFY_ENDING = 'notify-ending',
}

export enum TopicsConsumerEnum {
  START_SAGA = 'start-saga',
  ORCHESTRATOR = 'orchestrator',
  FINISH_SUCCESS = 'finish-success',
  FINISH_FAIL = 'finish-fail',
}

export enum SagaStatus {
  SUCCESS = 'SUCCESS',
  ROLLBACK_PENDING = 'ROLLBACK_PENDING',
  FAIL = 'FAIL',
}

export enum EventSource {
  ORCHESTRATOR = 'ORCHESTRATOR',
  PRODUCT_VALIDATION_SERVICE = 'PRODUCT_VALIDATION_SERVICE',
  PAYMENT_SERVICE = 'PAYMENT_SERVICE',
  INVENTORY_SERVICE = 'INVENTORY_SERVICE',
}
