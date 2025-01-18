import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';

import { InventoryEntitySchema } from '../entity/inventory';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { IInventoryRepository } from '../repository/inventory';
import { IOrderInventoryRepository } from '../repository/order-inventory';
import { ILoggerAdapter } from '@/infra/logger';
import { EventEntity } from '@/entities/event';
import { OrderInventoryStatus } from '../entity/order-inventory';
import { HistoricEntity } from '@/entities/historic';
import { DateUtils } from '@/utils/date';
import { ApiConflictException } from '@/utils/exception';

export const InventoryRollbackInputSchema = InventoryEntitySchema.pick({ id: true });

export class InventoryRollbackUsecase implements IUsecase {
  private readonly SOURCE = InventoryRollbackUsecase.name
  constructor(
    private readonly producer: IProducerAdapter,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly orderInventoryRepository: IOrderInventoryRepository,
    private readonly logger: ILoggerAdapter,
  ) {

  }

  async execute(input: InventoryRollbackInput): Promise<InventoryRollbackOutput> {
    const entity = new EventEntity(input)
    entity.status = OrderInventoryStatus.FAIL
    entity.source = this.SOURCE
    try {
      await this.rollbackInventory(entity)
      this.addHistoric(entity, "Rollback executed for inventory.")
    } catch (error) {
      this.addHistoric(entity, "Rollback not executed for inventory:" + error.message)
      this.logger.error(error)
    }
    finally {
      this.producer.publish(entity)
    }
  }

  async rollbackInventory(entity: EventEntity) {
    const orders = await this.orderInventoryRepository.findAll({ orderId: entity.orderId, transactionId: entity.transactionId })

    for (const order of orders) {
      const inventory = order.inventory
      await this.inventoryRepository.updateOne({ productCode: inventory.productCode }, { ...inventory, available: order.oldQuantity })
      this.logger.info({ message: `product: ${inventory.productCode} stock was update from ${inventory.available} to ${inventory.available}` })
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
}

export type InventoryRollbackInput = EventEntity;
export type InventoryRollbackOutput = void;
