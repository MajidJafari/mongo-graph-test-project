import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export abstract class BaseRepository<
  T extends { createdAt: Date; updatedAt: Date },
> {
  protected abstract readonly model: Model<T>;
  async create<CreateDto extends Partial<T>>(createDto: CreateDto): Promise<T> {
    return await new this.model({
      ...createDto,
      createdAt: new Date(),
    }).save();
  }
}
