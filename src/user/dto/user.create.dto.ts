import { ActivationStatus, UserTypes } from "../../types/global";

export class UserCreateDto {
  name: string;
  type: UserTypes;
  store: string;
  status?: ActivationStatus;
}
