import { UserCreateDto } from "../user/dto/user.create.dto";
import { UserTypes } from "../types/global";

export const testUser: UserCreateDto = {
  name: "test",
  username: "test",
  password: "test1234",
  type: UserTypes.Manager,
  store: null,
};
