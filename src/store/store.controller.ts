import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { UserRepo } from "../user/repositories/user.repo";
import { StoreRepo } from "./repositories/store.repo";
import { getUserByTypeValidationSchema } from "../utils/validation-schemas";
import { IUser } from "../user/schemas/user.schema";
import { UserFindAllDto } from "../user/dto/user.find.dto";
import { ActivationStatus } from "../types/global";

@Controller("stores")
export class StoreController {
  @Get("/:id/users/:type")
  @HttpCode(200)
  async getUsers(
    @Param(getUserByTypeValidationSchema())
    { id, type },
  ): Promise<{ data: IUser[] }> {
    return {
      data: await this.userRepo.findAll<UserFindAllDto>({
        type,
        store: id,
        status: ActivationStatus.Active,
      }),
    };
  }

  constructor(
    readonly storeRepo: StoreRepo,
    private readonly userRepo: UserRepo,
  ) {}
}
