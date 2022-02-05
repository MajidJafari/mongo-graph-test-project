import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Store, StoreSchema } from "./schemas/store.schema";
import { StoreRepo } from "./repositories/store.repo";
import { UserModule } from "../user/user.module";
import { StoreController } from "./store.controller";

@Module({
  providers: [StoreRepo],
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema, collection: "stores" },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [StoreController],
})
export class StoreModule {}
