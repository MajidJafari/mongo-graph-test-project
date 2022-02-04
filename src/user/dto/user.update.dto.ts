import { UserCreateDto } from "./user.create.dto";

export type UserUpdateDto = Partial<Omit<UserCreateDto, "status">>;
