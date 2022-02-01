import { Document, ObjectId } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActivationStatus } from '../../types/global';

export type IStore = Store & Document;

@Schema({ collection: 'stores' })
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop()
  parentStore: ObjectId;

  @Prop({ default: ActivationStatus.Active })
  status: ActivationStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
