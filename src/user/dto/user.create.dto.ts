import { ActivationStatus, UserTypes } from "../../types/global";

export class UserCreateDto {
  name: string;
  username: string;
  password: string;
  type: UserTypes;
  store: string;
  status?: ActivationStatus;
}
