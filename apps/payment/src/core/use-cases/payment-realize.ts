import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';

import { PaymentEntity, PaymentEntitySchema, PaymentStatus, ValidationStatus } from '../entity/payment';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { IPaymentRepository } from '../repository/payment';
import { EventEntity, EventEntitySchema } from '@/entities/event';
import { ILoggerAdapter } from '@/infra/logger';
import { TopicsProducerEnum } from '../../utils/topics';
import { ApiBadRequestException, ApiConflictException, ApiNotFoundException } from '@/utils/exception';
import { CollectionUtil } from '@/utils/collection';
import { HistoricEntity } from '@/entities/historic';
import { DateUtils } from '@/utils/date';
export const PaymentRealizeInputSchema = EventEntitySchema;

export class PaymentRealizeUsecase implements IUsecase {
  constructor(
    private readonly producer: IProducerAdapter,
    private readonly repository: IPaymentRepository,
    private readonly logger: ILoggerAdapter,
  ) {

  }

  private readonly SOURCE = PaymentRealizeUsecase.name

  async execute(payload: EventEntity): Promise<PaymentRealizeOutput> {
    const context = PaymentRealizeUsecase.name
    const topic = TopicsProducerEnum.ORCHESTRATOR

    this.logger.info({
      message: `message received from: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`, obj: {
        context,
        payload
      }
    })
    try {
      PaymentRealizeInputSchema.parse(payload)
      await this.verifyIfPaymentAlreadyExists(payload);

      await this.createPayment(payload)

      const payment = await this.getPayment(payload)

      this.validateAmount(payment)

      this.handlerSuccess(payload)

    } catch (error) {
      error.parameters = {
        context,
        info: "error trying to make payment",
        payload
      }
      this.logger.error(error)
      this.handlerFailCurrentNotExecuted(payload, error.message)
    }

    await this.producer.publish(payload)
  }

  private async verifyIfPaymentAlreadyExists(event: EventEntity) {
    const pagamentAlreadyExists = await this.repository.findOne({ orderId: event.orderId, transactionId: event.transactionId });
    if (pagamentAlreadyExists) {
      throw new ApiConflictException(`there's another payment with transactionId`);
    }
  }

  private handlerFailCurrentNotExecuted(event: EventEntity, message: string) {
    event.status = ValidationStatus.ROLLBACK_PENDING
    event.source = this.SOURCE
    this.addHistoric(event, `fail to realize payment: ${message}`)
  }

  private handlerSuccess(input: EventEntity) {
    input.status = PaymentStatus.SUCCESS
    input.source = this.SOURCE
    this.addHistoric(input, "payment realized successfully")
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

  async createPayment(event: EventEntity) {
    const totalAmount = this.calculateAmount(event)
    const totalItems = this.calculateTotalItems(event)

    const payment = new PaymentEntity({ orderId: event.orderId, transactionId: event.transactionId, totalAmount, totalItems })
    await this.saveOrUpdatePayment(payment)
    this.setEventAmountItem(event, payment)
    await this.changePaymentToSuccess(payment)
  }

  async saveOrUpdatePayment(payment: PaymentEntity) {
    const model = await this.repository.findOne({ orderId: payment.orderId, transactionId: payment.transactionId })
    if (!model) {
      return await this.repository.create(payment)
    }
    await this.repository.updateOne({ orderId: model.orderId, transactionId: model.transactionId }, payment)
  }

  validateAmount(event: PaymentEntity) {
    const MIN_AMOUNT_ALLOWED = 0.1;
    if (event.totalAmount < MIN_AMOUNT_ALLOWED) {
      throw new ApiBadRequestException(`the minimum amount availables is ${MIN_AMOUNT_ALLOWED}`)
    }
  }

  async getPayment(payment: EventEntity) {
    const model = await this.repository.findOne({ orderId: payment.orderId, transactionId: payment.transactionId })
    if (model) {
      throw new ApiNotFoundException("Payment not found by orderId and transactionId")
    }
    return model
  }

  async setEventAmountItem(event: EventEntity, payment: PaymentEntity) {
    event.payload.totalAmount = payment.totalAmount
    event.payload.totalItems = payment.totalItems
  }

  calculateAmount(event: EventEntity) {
    return CollectionUtil.sum(event.payload.products.map(p => p.quantity * p.product.unitValue))
  }

  calculateTotalItems(event: EventEntity) {
    return CollectionUtil.sum(event.payload.products.map(p => p.quantity))
  }

  async changePaymentToSuccess(payment: PaymentEntity) {
    payment.status = PaymentStatus.SUCCESS
    await this.saveOrUpdatePayment(payment)
  }
}

export type PaymentRealizeInput = z.infer<typeof PaymentRealizeInputSchema>;
export type PaymentRealizeOutput = void;


