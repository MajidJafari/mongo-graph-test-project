import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IStore, Store } from "../schemas/store.schema";
import { Model } from "mongoose";
import { BaseRepository } from "../../components/base-repository";
import { ActivationStatus, UserTypes } from "../../types/global";
import { IUser } from "../../user/schemas/user.schema";

@Injectable()
export class StoreRepo extends BaseRepository<IStore> {
  constructor(
    @InjectModel(Store.name) protected readonly model: Model<IStore>,
  ) {
    super();
  }

  async getOwnUsers(id: string, type: UserTypes): Promise<{ users: IUser[] }> {
    return (
      await this.aggregate()
        .match({
          _id: id,
          status: ActivationStatus.Active,
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
          users: 1,
        })
    )?.[0];
  }
}
