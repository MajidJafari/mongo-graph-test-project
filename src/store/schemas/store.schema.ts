import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EntityDocument } from "../../types/global";
import { BaseModel } from "../../components/base-model";

export type IStore = EntityDocument<Store>;

@Schema({ collection: "stores" })
export class Store extends BaseModel {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ index: true, type: MongooseSchema.Types.ObjectId })
  parentStore: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
