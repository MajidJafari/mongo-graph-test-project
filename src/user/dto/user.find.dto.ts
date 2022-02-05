import { ActivationStatus, UserTypes } from "../../types/global";

export class UserFindDto {
  name: { $regex: string };
}

export class UserFindAllDto {
  store: string;
  type: UserTypes;
  status: ActivationStatus.Active;
}
