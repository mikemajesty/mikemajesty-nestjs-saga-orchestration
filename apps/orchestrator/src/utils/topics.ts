
export enum TopicsProducerEnum {
  PRODUCT_VALIDATION_SUCCESS="product-validation-success",
  PRODUCT_VALIDATION_FAIL="product-validation-fail",
  INVENTORY_SUCCESS="inventory-success",
  INVENTORY_FAIL="inventory-fail",
  PAYMENT_SUCCESS="payment-success",
  PAYMENT_FAIL="payment-fail",
  NOTIFY_ENDING="notify-ending"
}

export enum TopicsConsumerEnum {
  START_SAGA="start-saga",
  ORCHESTRATOR="orchestrator",
  FINISH_SUCCESS="finish-success",
  FINISH_FAIL="finish-fail"
}