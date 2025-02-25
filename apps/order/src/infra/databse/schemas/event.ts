import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

import { EventEntity } from '@/core/event/entity/event';
import { HistoricEntity } from '@/core/order/entity/historic';
import { OrderEntity } from '@/core/order/entity/order';

export type EventDocument = Document & EventEntity;

@Schema({
  collection: 'events',
  autoIndex: true,
  timestamps: true,
})
export class Event {
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true, type: String })
  transactionId!: string;

  @Prop({ required: true, type: String })
  orderId: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: OrderEntity;

  @Prop({ required: false, type: String })
  source: string;

  @Prop({ required: false, type: String })
  status: string;

  @Prop({
    type: Array<mongoose.Schema.Types.Mixed>,
    required: false,
    default: [],
  })
  eventHistoric: HistoricEntity[];

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index(
  { transactionId: 1 },
  { partialFilterExpression: { deletedAt: { $eq: null } } },
);

EventSchema.plugin(paginate);

EventSchema.virtual('id').get(function () {
  return this._id;
});

export { EventSchema };
