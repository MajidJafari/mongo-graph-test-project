import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserRepo } from "./repositories/user.repo";
import { GenericValidatorPipe } from "../components/generic-validator-pipe";
import { ActivationStatus, UserTypes } from "../types/global";
import { Joi } from "../lib/custom-joi";

@Controller("users")
export class UserController {
  constructor(readonly userRepo: UserRepo) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(
      new GenericValidatorPipe<UserCreateDto>({
        name: Joi.string().min(3).max(32).required(),
        type: Joi.string()
          .valid(...Object.values(UserTypes))
          .required(),
        store: Joi.mongoId().required(),
        status: Joi.string().valid(...Object.values(ActivationStatus)),
      }),
    )
    userCreateDto: UserCreateDto,
  ) {
    return await this.userRepo.create<UserCreateDto>(userCreateDto);
  }
}
