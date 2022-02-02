import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ActivationStatus, UserTypes } from "../../types/global";

export type IUser = User & Document;

@Schema({ collection: "users" })
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, index: true })
  type: UserTypes;

  @Prop({ index: true })
  store: string;

  @Prop({ default: ActivationStatus.Active })
  status: ActivationStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
