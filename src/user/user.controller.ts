import { Body, Controller, HttpCode, Param, Post, Put } from "@nestjs/common";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserRepo } from "./repositories/user.repo";
import { GenericValidatorPipe } from "../components/generic-validator-pipe";
import { ActivationStatus, UserTypes } from "../types/global";
import { Joi } from "../lib/custom-joi";
import { UserUpdateDto } from "./dto/user.update.dto";

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

  @Put("/:id")
  @HttpCode(200)
  async update(
    @Param(
      new GenericValidatorPipe({
        id: Joi.mongoId().required(),
      }),
    )
    id,
    @Body(
      new GenericValidatorPipe<UserUpdateDto>({
        name: Joi.string().min(3).max(32),
        type: Joi.string().valid(...Object.values(UserTypes)),
        store: Joi.mongoId(),
      }),
    )
    userUpdateDto: UserUpdateDto,
  ): Promise<UserCreateDto> {
    return await this.userRepo.update<UserUpdateDto>(id, userUpdateDto);
  }
}
