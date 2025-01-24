import {
  EventSource,
  SagaStatus,
  TopicsConsumerEnum,
  TopicsProducerEnum,
} from './topics';

export class SagaOrderUtils {
  public static Handler: object[][] = [
    [
      EventSource.ORCHESTRATOR,
      SagaStatus.SUCCESS,
      TopicsProducerEnum.PRODUCT_VALIDATION_SUCCESS,
    ],
    [EventSource.ORCHESTRATOR, SagaStatus.FAIL, TopicsConsumerEnum.FINISH_FAIL],

    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      TopicsProducerEnum.PRODUCT_VALIDATION_FAIL,
    ],
    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.FAIL,
      TopicsConsumerEnum.FINISH_FAIL,
    ],
    [
      EventSource.PRODUCT_VALIDATION_SERVICE,
      SagaStatus.SUCCESS,
      TopicsProducerEnum.PAYMENT_SUCCESS,
    ],

    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      TopicsProducerEnum.PAYMENT_FAIL,
    ],
    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.FAIL,
      TopicsProducerEnum.PRODUCT_VALIDATION_FAIL,
    ],
    [
      EventSource.PAYMENT_SERVICE,
      SagaStatus.SUCCESS,
      TopicsProducerEnum.INVENTORY_SUCCESS,
    ],

    [
      EventSource.INVENTORY_SERVICE,
      SagaStatus.ROLLBACK_PENDING,
      TopicsProducerEnum.INVENTORY_FAIL,
    ],
    [
      EventSource.INVENTORY_SERVICE,
      SagaStatus.FAIL,
      TopicsProducerEnum.PAYMENT_FAIL,
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
