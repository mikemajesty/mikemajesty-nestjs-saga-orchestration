import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';

import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';
import { ApiConflictException, ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { IProductRepository } from '../../product/repository/product';
import {
  ProductValidationEntity,
  ProductValidationStatus,
} from '../entity/validation';
import { IProductValidationRepository } from '../repository/validation';

export class ValidationSuccessUsecase implements IUsecase {
  private readonly SOURCE = `PRODUCT_VALIDATION_SERVICE`;

  constructor(
    private readonly producer: IProducerAdapter,
    private readonly productRepository: IProductRepository,
    private readonly productValidationRepository: IProductValidationRepository,
    private readonly logger: ILoggerAdapter,
  ) {}

  async execute(
    event: ValidationSuccessInput,
  ): Promise<ValidationSuccessOutput> {
    const entity = new EventEntity(event);
    try {
      const sagaAlreadyExists = await this.productValidationRepository.findOne({
        orderId: entity.orderId,
        transactionId: entity.transactionId,
      });
      if (sagaAlreadyExists) {
        throw new ApiConflictException(`order: ${entity.id} already exists`);
      }
      const productCodeList = [];
      for (const { product } of entity.payload.products) {
        productCodeList.push(product.code);
      }
      const products = await this.productRepository.findIn({
        code: productCodeList,
      });
      if (productCodeList.length !== products.length) {
        throw new ApiNotFoundException(`products not found`);
      }
      this.checkValidation(entity);
      this.handlerSuccess(entity);
    } catch (error) {
      error.parameters = {
        context: ValidationSuccessUsecase.name,
        info: 'error trying to validade product',
      };
      this.logger.error(error);
      this.handlerFailCurrentNotExecuted(entity, error.message as string);
    } finally {
      await this.producer.publish(entity);
    }
  }

  private async checkValidation(input: EventEntity, success = true) {
    const entity = new ProductValidationEntity({
      orderId: input.payload.id,
      transactionId: input.transactionId,
      success,
    });

    await this.productValidationRepository.create(entity);
  }

  private handlerSuccess(input: EventEntity) {
    input.status = ProductValidationStatus.SUCCESS;
    input.source = this.SOURCE;
    this.addHistoric(input, 'products are validated successfully');
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

  private handlerFailCurrentNotExecuted(input: EventEntity, message: string) {
    input.status = ProductValidationStatus.ROLLBACK_PENDING;
    input.source = this.SOURCE;
    this.addHistoric(input, `fail to validate products: ${message}`);
  }
}

export type ValidationSuccessInput = EventEntity;
export type ValidationSuccessOutput = void;
