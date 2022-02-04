import { Prop } from "@nestjs/mongoose";
import { ActivationStatus } from "../types/global";

export class BaseModel {
  @Prop({ default: ActivationStatus.Active })
  status: ActivationStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
