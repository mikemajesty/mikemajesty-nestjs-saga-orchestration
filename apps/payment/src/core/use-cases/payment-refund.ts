import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from '../../infra/producer/adapter';
import { TopicsProducerEnum } from '../../utils/topics';
import {
  PaymentEntity,
  PaymentEntitySchema,
  PaymentStatus,
  ValidationStatus,
} from '../entity/payment';
import { IPaymentRepository } from '../repository/payment';
export const PaymentRefundInputSchema = PaymentEntitySchema.pick({ id: true });

export class PaymentRefundUsecase implements IUsecase {
  constructor(
    private readonly producer: IProducerAdapter,
    private readonly repository: IPaymentRepository,
    private readonly logger: ILoggerAdapter,
  ) {}

  private readonly SOURCE = 'PAYMENT_SERVICE';

  async execute(event: PaymentRefundInput): Promise<PaymentRefundOutput> {
    const topic = TopicsProducerEnum.ORCHESTRATOR;

    this.logger.info({
      message: `message received from: ${topic} with orderId: ${event.orderId} and transactionId: ${event.transactionId}`,
    });

    const entity = new EventEntity(event);
    entity.status = ValidationStatus.FAIL;
    entity.source = this.SOURCE;

    try {
      await this.changePaymentStatusToRefund(entity);
      this.addHistoric(entity, 'Rollback executed for payment.');
    } catch (error) {
      this.addHistoric(
        entity,
        'Rollback not executed for payment:' + error.message,
      );
      error.context = PaymentRefundUsecase.name;
      error.parameters = {
        info: 'error trying to rollback payment',
      };
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity);
    }
  }

  async changePaymentStatusToRefund(event: EventEntity) {
    const payment = await this.getPayment(event);
    payment.status = PaymentStatus.REFUND;
    this.setEventAmountItem(event, payment);
    await this.saveOrUpdatePayment(payment);
  }

  async setEventAmountItem(event: EventEntity, payment: PaymentEntity) {
    event.payload.totalAmount = payment.totalAmount;
    event.payload.totalItems = payment.totalItems;
  }

  private addHistoric(input: EventEntity, message: string) {
    const historic = new HistoricEntity({
      message,
      source: this.SOURCE,
      status: input.status,
      createdAt: DateUtils.getJSDate(),
    });

    input.eventHistoric.push(historic);
  }

  async getPayment(payment: EventEntity) {
    const model = await this.repository.findOne({
      orderId: payment.orderId,
      transactionId: payment.transactionId,
    });
    if (!model) {
      throw new ApiNotFoundException(
        'Payment not found by orderId and transactionId',
      );
    }
    return model;
  }

  async saveOrUpdatePayment(payment: PaymentEntity) {
    const model = await this.repository.findOne({
      orderId: payment.orderId,
      transactionId: payment.transactionId,
    });
    if (!model) {
      return await this.repository.create(payment);
    }
    await this.repository.updateOne(
      { orderId: model.orderId, transactionId: model.transactionId },
      payment,
    );
  }

  async changePaymentToSuccess(payment: PaymentEntity) {
    payment.status = PaymentStatus.SUCCESS;
    await this.saveOrUpdatePayment(payment);
  }
}

export type PaymentRefundInput = EventEntity;
export type PaymentRefundOutput = void;
