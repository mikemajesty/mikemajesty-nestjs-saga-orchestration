import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';

import { PaymentEntity, PaymentEntitySchema, PaymentStatus, ValidationStatus } from '../entity/payment';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { IPaymentRepository } from '../repository/payment';
import { ILoggerAdapter } from '@/infra/logger';
import { TopicsProducerEnum } from '../../utils/topics';
import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { DateUtils } from '@/utils/date';
import { ApiNotFoundException } from '@/utils/exception';
export const PaymentRefundInputSchema = PaymentEntitySchema.pick({ id: true });

export class PaymentRefundUsecase implements IUsecase {

  constructor(
    private readonly producer: IProducerAdapter,
    private readonly repository: IPaymentRepository,
    private readonly logger: ILoggerAdapter,
  ) {

  }

  private readonly SOURCE = PaymentRefundUsecase.name

  async execute(payload: PaymentRefundInput): Promise<PaymentRefundOutput> {
    const context = PaymentRefundUsecase.name
    const topic = TopicsProducerEnum.ORCHESTRATOR

    this.logger.info({
      message: `message received from: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`, obj: {
        context,
        payload
      }
    })

    await this.realizeRefund(payload)

  }

  async realizeRefund(event: EventEntity) {
    event.status = ValidationStatus.FAIL
    event.source = this.SOURCE
    try {
      await this.changePaymentStatusToRefund(event)
      this.addHistoric(event, "Rollback executed for payment.")
    } catch (error) {
      this.addHistoric(event, "Rollback not executed for payment:" + error.message)
      this.logger.error(error)
    }
    this.producer.publish(event)
  }

  async changePaymentStatusToRefund(event: EventEntity) {
    const payment = await this.getPayment(event)
    payment.status = PaymentStatus.REFUND
    this.setEventAmountItem(event, payment)
    await this.saveOrUpdatePayment(payment)
  }

  async setEventAmountItem(event: EventEntity, payment: PaymentEntity) {
    event.payload.totalAmount = payment.totalAmount
    event.payload.totalItems = payment.totalItems
  }

  private addHistoric(input: EventEntity, message: string) {
    const historic = new HistoricEntity({
      message,
      source: this.SOURCE,
      status: input.status,
      createdAt: DateUtils.getJSDate()
    })

    input.eventHistoric.push(historic)
  }

  async getPayment(payment: EventEntity) {
    const model = await this.repository.findOne({ orderId: payment.orderId, transactionId: payment.transactionId })
    if (!model) {
      throw new ApiNotFoundException("Payment not found by orderId and transactionId")
    }
    return model
  }


  async saveOrUpdatePayment(payment: PaymentEntity) {
    const model = await this.repository.findOne({ orderId: payment.orderId, transactionId: payment.transactionId })
    if (!model) {
      return await this.repository.create(payment)
    }
    await this.repository.updateOne({ orderId: model.orderId, transactionId: model.transactionId }, payment)
  }

  async changePaymentToSuccess(payment: PaymentEntity) {
    payment.status = PaymentStatus.SUCCESS
    await this.saveOrUpdatePayment(payment)
  }
}

export type PaymentRefundInput = EventEntity;
export type PaymentRefundOutput = void;
