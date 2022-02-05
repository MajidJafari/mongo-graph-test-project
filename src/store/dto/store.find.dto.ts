import { ActivationStatus } from "../../types/global";

export class StoreFindDto {
  _id: string;
  type: string;
  status?: ActivationStatus;
}
