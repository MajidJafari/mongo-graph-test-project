import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { getUserByTypeValidationSchema } from "../utils/validation-schemas";
import { IUser } from "../user/schemas/user.schema";
import { GenericValidatorPipe } from "../components/generic-validator-pipe";
import * as Joi from "joi";
import { UserTypes } from "../types/global";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
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
    data: {
      ownUsers: IUser[];
      descendantUsers: IncludeDescendants extends true ? IUser[] : never;
    };
  }> {
    const { id, type } = params;
    const { includeDescendants } = query;
    const ownUsers = (await this.storeRepo.getOwnUsers(id, type))?.users || [];

    return {
      data: {
        ownUsers,
        descendantUsers: (includeDescendants
          ? (await this.storeRepo.getDescendantUsers(id, type)).reduce<IUser[]>(
              (previousValue, currentValue) =>
                previousValue.concat(currentValue.users),
              [],
            )
          : undefined) as IncludeDescendants extends true ? IUser[] : never,
      },
    };
  }
}
