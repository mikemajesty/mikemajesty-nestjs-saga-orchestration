import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';

import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import {
  ProductValidationEntity,
  ProductValidationStatus,
} from '../entity/validation';
import { IProductValidationRepository } from '../repository/validation';

export class ValidateRollbackUsecase implements IUsecase {
  private readonly SOURCE = `PRODUCT_VALIDATION_SERVICE`;

  constructor(
    private readonly producer: IProducerAdapter,
    private readonly productValidationRepository: IProductValidationRepository,
    private readonly logger: ILoggerAdapter,
  ) {}

  async execute(event: ValidateRollbackInput): Promise<ValidateRollbackOutput> {
    const entity = new EventEntity(event);
    try {
      entity.status = ProductValidationStatus.FAIL;
      entity.source = this.SOURCE;
      const historic = new HistoricEntity({
        message: 'rollback executed on product validation',
        source: this.SOURCE,
        status: entity.status,
        createdAt: DateUtils.getJSDate(),
      });
      entity.eventHistoric.push(historic);
      const productValidation = await this.productValidationRepository.findOne({
        orderId: entity.orderId,
        transactionId: entity.transactionId,
      });
      if (!productValidation) {
        await this.checkValidation(entity);
        throw new ApiNotFoundException(
          `order ${entity.orderId} and transactionId: ${entity.transactionId} not found`,
        );
      }
      await this.productValidationRepository.updateOne(
        { orderId: entity.orderId, transactionId: entity.transactionId },
        { success: false },
      );
    } catch (error) {
      error.parameters = {
        context: ValidateRollbackUsecase.name,
        info: 'error trying to rollback validade product',
      };
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity);
    }
  }

  private async checkValidation(input: EventEntity, success = false) {
    const entity = new ProductValidationEntity({
      orderId: input.payload.id,
      transactionId: input.transactionId,
      success,
    });

    await this.productValidationRepository.create(entity);
  }
}

export type ValidateRollbackInput = EventEntity;
export type ValidateRollbackOutput = void;
