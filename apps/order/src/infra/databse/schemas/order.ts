import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { OrderEntity } from 'apps/order/src/core/order/entity/order';

export type OrderDocument = Document & OrderEntity;

@Schema({
  collection: 'orders',
  autoIndex: true,
  timestamps: true
})
export class Order {
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true, type: String })
  transactionId!: string;

  @Prop({ required: true, type: String })
  orderId!: string;

  @Prop({ minlength: 1, required: true, type: mongoose.Schema.Types.Mixed })
  payload!: unknown;

  @Prop({ required: true, type: String })
  source: string
  
  @Prop({ required: true, type: String })
  status: string
  
  @Prop({ type: Array<mongoose.Schema.Types.Mixed> })
  eventHistoric: unknown[]

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ transactionId: 1 }, { partialFilterExpression: { deletedAt: { $eq: null } } });

OrderSchema.plugin(paginate);

OrderSchema.virtual('id').get(function () {
  return this._id;
});

export { OrderSchema };