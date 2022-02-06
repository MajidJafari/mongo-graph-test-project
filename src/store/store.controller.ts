import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { getUserByTypeValidationSchema } from "../utils/validation-schemas";
import { IUser } from "../user/schemas/user.schema";

@Controller("stores")
export class StoreController {
  constructor(readonly storeRepo: StoreRepo) {}

  @Get("/:id/users/:type")
  @HttpCode(200)
  async getUsers(
    @Param(getUserByTypeValidationSchema())
    { id, type },
  ): Promise<{ data: IUser[] }> {
    return (
      (
        await this.storeRepo
          .aggregate()
          .match({
            _id: id,
          })
          .lookup({
            from: "users",
            localField: "_id",
            foreignField: "store",
            pipeline: [
              {
                $match: {
                  type,
                },
              },
            ],
            as: "users",
          })
          .project({
            _id: 0,
            data: "$users",
          })
      )?.[0] || { data: [] }
    );
  }
}
