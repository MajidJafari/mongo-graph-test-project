import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EntityDocument, UserTypes } from "../../types/global";
import { BaseModel } from "../../components/base-model";

export type IUser = EntityDocument<User>;

@Schema({ collection: "users" })
export class User extends BaseModel {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, index: true })
  type: UserTypes;

  @Prop({ index: true, type: MongooseSchema.Types.ObjectId })
  store: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
