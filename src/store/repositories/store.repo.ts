import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IStore, Store } from '../schemas/store.schema';
import { Model } from 'mongoose';
import { StoreCreateDto } from '../dto/store.create.dto';

@Injectable()
export class StoreRepo {
  constructor(@InjectModel(Store.name) private readonly model: Model<IStore>) {}

  async create(createDto: StoreCreateDto): Promise<IStore> {
    return await new this.model({
      ...createDto,
      createdAt: new Date(),
    }).save();
  }
}
