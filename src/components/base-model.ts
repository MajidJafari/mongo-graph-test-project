import { Prop } from "@nestjs/mongoose";
import { ActivationStatus } from "../types/global";

export class BaseModel {
  @Prop({
    default: ActivationStatus.Active,
    enum: Object.values(ActivationStatus),
  })
  status: ActivationStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
