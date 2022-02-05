import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { UserRepo } from "../user/repositories/user.repo";
import { StoreRepo } from "./repositories/store.repo";
import {
  getIdValidationSchema,
  getUserTypeVlidationSchema,
} from "../utils/validation-schemas";
import { NotImplemented } from "../exceptions/not-implemented";
import { IUser } from "../user/schemas/user.schema";

@Controller("stores")
export class StoreController {
  constructor(
    readonly storeRepo: StoreRepo,
    private readonly userRepo: UserRepo,
  ) {}

  @Get("/:id/users/:type")
  @HttpCode(200)
  async getUsers(
    @Param(getIdValidationSchema()) id,
    @Param(getUserTypeVlidationSchema()) type,
  ): Promise<{ data: IUser[] }> {
    throw new NotImplemented({
      className: this.constructor.name,
      methodName: "getUsers",
    });
  }
}
