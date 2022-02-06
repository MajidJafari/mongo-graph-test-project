import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { getUserByTypeValidationSchema } from "../utils/validation-schemas";
import { IUser } from "../user/schemas/user.schema";
import { GenericValidatorPipe } from "../components/generic-validator-pipe";
import * as Joi from "joi";
import { UserTypes } from "../types/global";

@Controller("stores")
export class StoreController {
  constructor(readonly storeRepo: StoreRepo) {}

  @Get("/:id/users/:type")
  @HttpCode(200)
  async getUsers<IncludeDescendants extends boolean = false>(
    @Param(getUserByTypeValidationSchema())
    params: { id: string; type: UserTypes },
    @Query(
      new GenericValidatorPipe<{ includeDescendants?: boolean }>({
        includeDescendants: Joi.boolean(),
      }),
    )
    query = { includeDescendants: false },
  ): Promise<{
    data: IncludeDescendants extends false
      ? IUser[]
      : { ownUsers: IUser[]; descendantUsers: IUser[] };
  }> {
    const { id, type } = params;
    const { includeDescendants } = query;
    const ownUsers = (await this.storeRepo.getOwnUsers(id, type))?.users || [];

    return {
      data: !includeDescendants
        ? ownUsers
        : {
            ownUsers,
            descendantUsers: (
              await this.storeRepo.getDescendantUsers(id, type)
            ).reduce(
              (previousValue, currentValue) =>
                previousValue.concat(currentValue.users),
              [],
            ),
          },
    } as any;
  }
}
