import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IStore, Store } from "../schemas/store.schema";
import { Model } from "mongoose";
import { BaseRepository } from "../../components/base-repository";

@Injectable()
export class StoreRepo extends BaseRepository<IStore> {
  constructor(
    @InjectModel(Store.name) protected readonly model: Model<IStore>,
  ) {
    super();
  }
}
