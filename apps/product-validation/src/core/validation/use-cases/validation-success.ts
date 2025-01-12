import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';
import { IProductRepository } from '../../product/repository/product';
import { IProductValidationRepository } from '../repository/validation';
import { EventEntity } from '@/entities/event';
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
      this.checkCurrenyValidation(input)
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

    await firstValueFrom(this.producer.publish(JSON.stringify(input)))
  }

  private async checkCurrenyValidation(input: EventEntity) {
    this.verifyIfProductsWasInfomed(input)
    await this.validateIfOrderExixts(input);
    await this.validateIfProductExists(input);
  }

  private async validateIfOrderExixts(input: EventEntity) {
    const sagaAlreadyExists = await this.productValidationRepository.findBy({ orderId: [input.id], transactionId: [input.transactionId] });
    if (sagaAlreadyExists) {
      throw new ApiConflictException(`order: ${input.id} already exists`);
    }
  }

  private async validateIfProductExists(input: EventEntity) {
    const productIds = Array.from(new Set(input.payload.products.map(p => p.id)));
    const products = await this.productRepository.findIn({ id: productIds });

    if (productIds.length !== products.length) {
      throw new ApiNotFoundException(`products not found`);
    }
  }

  private verifyIfProductsWasInfomed(input: EventEntity) {
    if ([!input?.payload, !input?.payload?.products?.length].some(Boolean)) {
      throw new ApiBadRequestException(`product list is empty`)
    }

    if ([!input.payload.id, !input.payload.transactionId].some(Boolean)) {
      throw new ApiBadRequestException(`order or transactionId is empty`)
    }
  }

  private async checkValidation(input: EventEntity, success = true) {
    const entity =  new ProductValidationEntity({
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

  private handlerFailCurrentNotExecuted(input: EventEntity, arg1: string) {
    throw new Error('Function not implemented.');
  }
}

export type ValidationSuccessInput = EventEntity;
export type ValidationSuccessOutput = void;

