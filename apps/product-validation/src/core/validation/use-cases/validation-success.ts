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

export class ValidationSuccessUsecase implements IUsecase {

  private readonly SOURCE = `product-validation-usecase`

  constructor(
    private readonly producer: IProducerAdapter,
    private readonly productRepository: IProductRepository,
    private readonly productValidationRepository: IProductValidationRepository,
    private readonly logger: ILoggerAdapter,
  ) {
  }

  async execute(input: ValidationSuccessInput): Promise<ValidationSuccessOutput> {
    try {
      EventEntitySchema.parse(input)
      const sagaAlreadyExists = await this.productValidationRepository.findOne({ orderId: input.orderId, transactionId: input.transactionId });
      if (sagaAlreadyExists) {
        throw new ApiConflictException(`order: ${input.id} already exists`);
      }
      const productCodeList = []
      for (const { product } of input.payload.products) {
        productCodeList.push(product.code)
      }
      const products = await this.productRepository.findIn({ code: productCodeList });
      if (productCodeList.length !== products.length) {
        throw new ApiNotFoundException(`products not found`);
      }
      this.checkValidation(input)
      this.handlerSuccess(input)

    } catch (error) {
      error.parameters = {
        context: ValidationSuccessUsecase.name,
        source: this.SOURCE,
        info: "error trying to validade product",
        payload: input
      }
      this.logger.error(error)
      this.handlerFailCurrentNotExecuted(input, error.message as string)
    }

    this.producer.publish(input)
  }

  private async checkValidation(input: EventEntity, success = true) {
    const entity = new ProductValidationEntity({
      orderId: input.payload.id,
      transactionId: input.transactionId,
      success
    })

    await this.productValidationRepository.create(entity)
  }

  private handlerSuccess(input: EventEntity) {
    input.status = ProductValidationStatus.SUCCESS
    input.source = this.SOURCE
    this.addHistoric(input, "products are validated successfully")
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

  private handlerFailCurrentNotExecuted(input: EventEntity, message: string) {
    input.status = ProductValidationStatus.ROLLBACK_PENDING
    input.source = this.SOURCE
    this.addHistoric(input, `fail to validate products: ${message}`)
  }
}

export type ValidationSuccessInput = EventEntity;
export type ValidationSuccessOutput = void;

