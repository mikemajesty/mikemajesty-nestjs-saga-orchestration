import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { OrderEntity } from '@/entities/order';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';
import {
  ApiNotFoundException,
  ApiUnprocessableEntityException,
} from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { IProducerAdapter } from '../../infra/producer/adapter';
import { InventoryEntitySchema } from '../entity/inventory';
import {
  OrderInventoryEntity,
  OrderInventoryStatus,
} from '../entity/order-inventory';
import { IInventoryRepository } from '../repository/inventory';
import { IOrderInventoryRepository } from '../repository/order-inventory';

export const InventoryUpdateInputSchema = InventoryEntitySchema.pick({
  id: true,
});

export class InventoryUpdateUsecase implements IUsecase {
  private readonly SOURCE = 'INVENTORY_SERVICE';
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly orderInventoryRepository: IOrderInventoryRepository,
    private readonly producer: IProducerAdapter,
    private readonly logger: ILoggerAdapter,
  ) {}

  async execute(event: InventoryUpdateInput): Promise<InventoryUpdateOutput> {
    const entity = new EventEntity(event);
    try {
      await this.checkCurrentyValidation(entity);
      await this.createOrderInventory(entity);
      await this.updateInventory(entity.payload);
      this.handlerSuccess(entity);
    } catch (error) {
      error.parameters = {
        info: 'error trying to update inventory',
      };
      error.context = InventoryUpdateUsecase.name;
      this.logger.error(error);
      this.handlerFailCurrentNotExecuted(entity, error.message);
    }

    await this.producer.publish(entity);
  }

  private handlerSuccess(input: EventEntity) {
    input.status = OrderInventoryStatus.SUCCESS;
    input.source = this.SOURCE;
    this.addHistoric(input, 'Inventory updated successfully');
  }

  async updateInventory(entity: OrderEntity) {
    for (const product of entity.products) {
      const inventory = await this.inventoryRepository.findOne({
        productCode: product.product.code,
      });
      if (!inventory) {
        throw new ApiNotFoundException(
          `inventory not found by informed code: ${product.product.code}`,
        );
      }

      if (product.quantity > inventory.available) {
        throw new ApiUnprocessableEntityException(
          `product: ${product.product.code} out of stock.`,
        );
      }

      await this.inventoryRepository.updateOne(
        { productCode: product.product.code },
        { ...inventory, available: inventory.available - product.quantity },
      );
      this.logger.info({
        message: `product: ${product.product.code} stock was update from ${inventory.available} to ${inventory.available - product.quantity}`,
      });
    }
  }

  private checkCurrentyValidation = async (event: EventEntity) => {
    const order = await this.orderInventoryRepository.findOne({
      transactionId: event.transactionId,
      orderId: event.orderId,
    });
    if (order) {
      throw new ApiNotFoundException(
        'there another transactionId a for this ordeId',
      );
    }
  };

  private createOrderInventory = async (event: EventEntity) => {
    for (const product of event.payload.products) {
      const inventory = await this.inventoryRepository.findOne({
        productCode: product.product.code,
      });
      if (!inventory) {
        throw new ApiNotFoundException(
          `inventory not found by informed code: ${product.product.code}`,
        );
      }
      const orderInventory = new OrderInventoryEntity({
        inventory,
        orderQuantity: product.quantity,
        newQuantity: inventory.available - product.quantity,
        oldQuantity: inventory.available,
        orderId: event.orderId,
        transactionId: event.transactionId,
      });
      await this.orderInventoryRepository.create(orderInventory);
    }
  };

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
    input.status = OrderInventoryStatus.ROLLBACK_PENDING;
    input.source = this.SOURCE;
    this.addHistoric(input, `fail to update inventory: ${message}`);
  }
}

export type InventoryUpdateInput = EventEntity;
export type InventoryUpdateOutput = void;
