import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const Source = z.string()
const Status = z.string()
const Message = z.string()
const CreatedAt = z.date().nullish();

export const HistoricEntitySchema = z.object({
  source: Source,
  status: Status,
  message: Message,
  createdAt: CreatedAt,
});

type Historic = z.infer<typeof HistoricEntitySchema>;

export class HistoricEntity extends BaseEntity<HistoricEntity>() {
  source!: string;

  status!: string;

  message!: string;

  constructor(entity: Historic) {
    super(HistoricEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}