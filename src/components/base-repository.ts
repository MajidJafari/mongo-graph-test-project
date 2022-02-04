import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { EntityDocument } from "../types/global";

@Injectable()
export abstract class BaseRepository<T extends EntityDocument<any>> {
  protected abstract readonly model: Model<T>;
  async create<CreateDto extends Partial<T>>(createDto: CreateDto): Promise<T> {
    return await new this.model({
      ...createDto,
      createdAt: new Date(),
    }).save();
  }
}
