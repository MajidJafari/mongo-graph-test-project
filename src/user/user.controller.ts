import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserRepo } from "./repositories/user.repo";

@Controller("users")
export class UserController {
  constructor(readonly userRepo: UserRepo) {}

  @Post()
  @HttpCode(201)
  async create(@Body() userCreateDto: UserCreateDto) {
    return await this.userRepo.create<UserCreateDto>(userCreateDto);
  }
}
