import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { getUserByTypeValidationSchema } from "../utils/validation-schemas";
import { IUser } from "../user/schemas/user.schema";
import { UserTypes } from "../types/global";

@Controller("stores")
export class StoreController {
  constructor(readonly storeRepo: StoreRepo) {}

  @Get("/:id/users/:type")
  @HttpCode(200)
  async getUsers(
    @Param(getUserByTypeValidationSchema())
    params: {
      id: string;
      type: UserTypes;
    },
  ): Promise<{ data: IUser[] }> {
    const { id, type } = params;

    return { data: (await this.storeRepo.getOwnUsers(id, type))?.users || [] };
  }
}
