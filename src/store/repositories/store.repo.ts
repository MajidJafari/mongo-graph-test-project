import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IStore, Store } from "../schemas/store.schema";
import { Model, PipelineStage } from "mongoose";
import { BaseRepository } from "../../components/base-repository";
import { ActivationStatus, UserTypes } from "../../types/global";
import { IUser } from "../../user/schemas/user.schema";
import { ObjectId } from "bson";

@Injectable()
export class StoreRepo extends BaseRepository<IStore> {
  constructor(
    @InjectModel(Store.name) protected readonly model: Model<IStore>,
  ) {
    super();
  }

  async getOwnUsers(id: string, type: UserTypes): Promise<{ users: IUser[] }> {
    const { lookup, project } = this.getCommonAggregationStages(type);
    return (
      await this.aggregate()
        .match({
          _id: new ObjectId(id),
          status: ActivationStatus.Active,
        })
        .lookup(lookup)
        .project(project)
    )?.[0];
  }

  async getDescendantUsers(
    id: string,
    type: UserTypes,
  ): Promise<{ users: IUser[] }[]> {
    const { lookup, project } = this.getCommonAggregationStages(type);
    return this.aggregate()
      .match({
        status: ActivationStatus.Active,
      })
      .graphLookup({
        from: "stores",
        startWith: "$parentStore",
        connectFromField: "parentStore",
        connectToField: "_id",
        depthField: "level",
        as: "ancestors",
        restrictSearchWithMatch: {
          status: ActivationStatus.Active,
        },
      })
      .match({
        "ancestors._id": new ObjectId(id),
      })
      .lookup(lookup)
      .project(project);
  }

  getCommonAggregationStages(type: UserTypes): {
    lookup: PipelineStage.Lookup["$lookup"];
    project: PipelineStage.Project["$project"];
  } {
    return {
      lookup: {
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
      },
      project: {
        _id: 0,
        users: 1,
      },
    };
  }
}
