import {
  EventEntity as Entity,
  EventEntitySchema as Schema,
} from '@/entities/event';

export const EventEntitySchema = Schema;

export class EventEntity extends Entity {}
