import { EventSource, SagaStatus, TopicsConsumerEnum, TopicsProducerEnum as Producer } from "./topics";

export class SagaOrderUtils {
  public static Handler: unknown[][] = [
    [
      EventSource.ORCHESTRATOR,
      SagaStatus.SUCCESS,
      Producer.PRODUCT_VALIDATION_SUCCESS,
    ],
    [EventSource.ORCHESTRATOR, SagaStatus.FAIL, TopicsConsumerEnum.FINISH_FAIL],

    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      Producer.PRODUCT_VALIDATION_FAIL,
    ],
    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.FAIL,
      TopicsConsumerEnum.FINISH_FAIL,
    ],
    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.SUCCESS,
      Producer.PAYMENT_SUCCESS,
    ],

    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      Producer.PAYMENT_FAIL,
    ],
    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.FAIL,
      Producer.PRODUCT_VALIDATION_FAIL,
    ],
    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.SUCCESS,
      Producer.INVENTORY_SUCCESS,
    ],

    [
      EventSource.INVENTORY_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      Producer.INVENTORY_FAIL,
    ],
    [
      EventSource.INVENTORY_SERVICE,
      SagaStatus.FAIL,
      Producer.PAYMENT_FAIL,
    ],
    [
      EventSource.INVENTORY_SERVICE,
      SagaStatus.SUCCESS,
      TopicsConsumerEnum.FINISH_SUCCESS,
    ],
  ];

  public static EVENT_SOURCE_INDEX = 0;
  public static EVENT_STATUS_INDEX = 1;
  public static NEXT_TOPIC_INDEX = 2;
}
