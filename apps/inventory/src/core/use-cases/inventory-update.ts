import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';

import { InventoryEntitySchema } from '../entity/inventory';
import { EventEntity } from '@/entities/event';
import { IInventoryRepository } from '../repository/inventory';
import { IOrderInventoryRepository } from '../repository/order-inventory';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ILoggerAdapter } from '@/infra/logger';
import { HistoricEntity } from '@/entities/historic';
import { DateUtils } from '@/utils/date';
import { ApiNotFoundException, ApiUnprocessableEntityException } from '@/utils/exception';
import { OrderInventoryEntity, OrderInventoryStatus } from '../entity/order-inventory';
import { OrderEntity } from '@/entities/order';

export const InventoryUpdateInputSchema = InventoryEntitySchema.pick({ id: true });

export class InventoryUpdateUsecase implements IUsecase {

  private readonly SOURCE = InventoryUpdateUsecase.name
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly orderInventoryRepository: IOrderInventoryRepository,
    private readonly producer: IProducerAdapter,
    private readonly logger: ILoggerAdapter,
  ) { }

  async execute(event: InventoryUpdateInput): Promise<InventoryUpdateOutput> {
    const entity = new EventEntity(event)
    try {
      await this.checkCurrentyValidation(entity)
      await this.createOrderInventory(entity)
      await this.updateInventory(entity.payload)
      this.handlerSuccess(entity)
    } catch (error) {
      error.parameters = {
        context: this.SOURCE,
        source: this.SOURCE,
        info: "error trying to update inventory",
        payload: entity
      }
      this.logger.error(error)
      this.handlerFailCurrentNotExecuted(entity, error.message)
    }

    await this.producer.publish(entity)
  }

  private handlerSuccess(input: EventEntity) {
    input.status = OrderInventoryStatus.SUCCESS
    input.source = this.SOURCE
    this.addHistoric(input, "Inventory updated successfully")
  }

  async updateInventory(entity: OrderEntity) {
    for (const product of entity.products) {
      const inventory = await this.inventoryRepository.findOne({ productCode: product.product.code })
      if (!inventory) {
        throw new ApiNotFoundException(`inventory not found by informed code: ${product.product.code}`)
      }

      if (product.quantity > inventory.available) {
        throw new ApiUnprocessableEntityException(`product: ${product.product.code} out of stock.`)
      }

      inventory.available = inventory.available - product.quantity

      await this.inventoryRepository.updateOne({ productCode: product.product.code }, inventory)
    }
  }

  private checkCurrentyValidation = async (event: EventEntity) => {
    const order = await this.orderInventoryRepository.findOne({ transactionId: event.transactionId, orderId: event.orderId })
    if (order) {
      throw new ApiNotFoundException('there another transactionId a for this ordeId')
    }
  }

  private createOrderInventory = async (event: EventEntity) => {
    for (const product of event.payload.products) {
      const inventory = await this.inventoryRepository.findOne({ productCode: product.product.code })
      if (!inventory) {
        throw new ApiNotFoundException(`inventory not found by informed code: ${product.product.code}`)
      }
      const orderInventory = new OrderInventoryEntity({
        inventory,
        orderQuantity: product.quantity,
        newQuantity: inventory.available - product.quantity,
        oldQuantity: inventory.available,
        orderId: event.orderId,
        transactionId: event.transactionId,
      })
      await this.orderInventoryRepository.create(orderInventory)
    }
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
    input.status = OrderInventoryStatus.ROLLBACK_PENDING
    input.source = this.SOURCE
    this.addHistoric(input, `fail to update inventory: ${message}`)
  }
}

export type InventoryUpdateInput = EventEntity;
export type InventoryUpdateOutput = void;
