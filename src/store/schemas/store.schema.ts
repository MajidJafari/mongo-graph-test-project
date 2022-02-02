import { Document, ObjectId } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ActivationStatus } from "../../types/global";

export type IStore = Store & Document;

@Schema({ collection: "stores" })
export class Store {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ index: true })
  parentStore: string;

  @Prop({ default: ActivationStatus.Active })
  status: ActivationStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
