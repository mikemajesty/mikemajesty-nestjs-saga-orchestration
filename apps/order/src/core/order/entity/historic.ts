import {
  HistoricEntity as Entity,
  HistoricEntitySchema as Schema,
} from '@/entities/historic';

export const HistoricEntitySchema = Schema;

export class HistoricEntity extends Entity {}
