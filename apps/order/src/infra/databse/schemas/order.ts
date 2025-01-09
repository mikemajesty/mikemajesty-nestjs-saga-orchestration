import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

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
  
  @Prop({ type: Array<mongoose.Schema.Types.Mixed> })
  products: unknown[]

  @Prop({ required: true, type: Number })
  totalAmount!: number;
  
  @Prop({ required: true, type: Number })
  totalItems!: number;

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