import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';
import { IProductRepository } from '../../product/repository/product';
import { IProductValidationRepository } from '../repository/validation';
import { EventEntity } from '@/entities/event';
import { ILoggerAdapter } from '@/infra/logger';
import { firstValueFrom } from 'rxjs';

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

  private checkCurrenyValidation(input: Event) {
    throw new Error('Function not implemented.');
  }
  
  private checkValidation(input: Event) {
    throw new Error('Function not implemented.');
  }
  
  private handlerSuccess(input: Event) {
    throw new Error('Function not implemented.');
  }

  private handlerFailCurrentNotExecuted(input: Event, arg1: string) {
    throw new Error('Function not implemented.');
  }
}

export type ValidationSuccessInput = Event;
export type ValidationSuccessOutput = void;

