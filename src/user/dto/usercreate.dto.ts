import { ActivationStatus, UserTypes } from "../../types/global";

export class UsercreateDto {
  name: string;
  type: UserTypes;
  store: string;
  status?: ActivationStatus;
}
