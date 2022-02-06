import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EntityDocument, UserTypes } from "../../types/global";
import { BaseModel } from "../../components/base-model";

export type IUser = EntityDocument<User>;

@Schema({ collection: "users" })
export class User extends BaseModel {
  @Prop({ index: true, unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true, enum: Object.values(UserTypes) })
  type: UserTypes;

  @Prop({ index: true, required: true, type: MongooseSchema.Types.ObjectId })
  store: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
