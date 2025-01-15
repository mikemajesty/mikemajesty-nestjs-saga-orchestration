import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';
import { IProductRepository } from '../../product/repository/product';
import { IProductValidationRepository } from '../repository/validation';
import { EventEntity, EventEntitySchema } from '@/entities/event';
import { ILoggerAdapter } from '@/infra/logger';
import { firstValueFrom } from 'rxjs';
import { ApiBadRequestException, ApiConflictException, ApiNotFoundException } from '@/utils/exception';
import { ProductValidationEntity, ProductValidationStatus } from '../entity/validation';
import { HistoricEntity } from '@/entities/historic';
import { DateUtils } from '@/utils/date';

export class ValidateRollbackUsecase implements IUsecase {

  private readonly SOURCE = `product-validation-usecase`

  constructor(
    private readonly producer: IProducerAdapter,
    private readonly productValidationRepository: IProductValidationRepository,
    private readonly logger: ILoggerAdapter,
  ) {
  }

  async execute(input: ValidateRollbackInput): Promise<ValidateRollbackOutput> {
    try {
      const event = new EventEntity(input)
      event.status = ProductValidationStatus.FAIL
      event.source = this.SOURCE
      const historic = new HistoricEntity({ message: 'rollback executed on product validation', source: this.SOURCE, status: event.status, createdAt: DateUtils.getJSDate() })
      event.eventHistoric.push(historic)
      const productValidation = await this.productValidationRepository.findOne({ orderId: event.orderId, transactionId: event.transactionId })
      if (!productValidation) {
        await this.checkValidation(event)
        throw new ApiNotFoundException(`order ${event.orderId} and transactionId: ${event.transactionId} not found`)
      }
      await this.productValidationRepository.updateOne({ orderId: event.orderId, transactionId: event.transactionId }, { success: false })
      await this.producer.publish(event)
    } catch (error) {
      error.parameters = {
        context: ValidateRollbackUsecase.name,
        source: this.SOURCE,
        info: "error trying to rollback validade product",
        payload: input
      }
      this.logger.error(error)
    }
  }

  private async checkValidation(input: EventEntity, success = false) {
    const entity =  new ProductValidationEntity({
      orderId: input.payload.id,
      transactionId: input.transactionId,
      success
    })

    await this.productValidationRepository.create(entity)
  }
}

export type ValidateRollbackInput = EventEntity;
export type ValidateRollbackOutput = void;

