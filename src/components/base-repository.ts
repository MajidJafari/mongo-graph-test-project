import { Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";
import { EntityDocument } from "../types/global";
import { ObjectId } from "bson";

@Injectable()
export abstract class BaseRepository<T extends EntityDocument<any>> {
  protected abstract readonly model: Model<T>;
  async create<CreateDto extends Partial<T>>(createDto: CreateDto): Promise<T> {
    return (
      await new this.model({
        ...createDto,
        createdAt: new Date(),
      }).save()
    ).toObject() as T;
  }

  async deleteMany<DeleteDto extends Partial<T>>(deleteDto: DeleteDto) {
    return !!(await this.model.deleteMany(deleteDto)).deletedCount;
  }

  async findOne<FindDto extends Partial<FilterQuery<T>>>(
    findDto: FindDto,
  ): Promise<T> {
    return (await this.model.findOne(findDto)).toObject() as T;
  }

  async findById(id: string | ObjectId): Promise<T> {
    return (await this.model.findById(id)).toObject() as T;
  }
}
