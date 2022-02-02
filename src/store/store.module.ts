import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Store, StoreSchema } from "./schemas/store.schema";
import { StoreRepo } from "./repositories/store.repo";

@Module({
  providers: [StoreRepo],
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema, collection: "stores" },
    ]),
  ],
})
export class StoreModule {}
