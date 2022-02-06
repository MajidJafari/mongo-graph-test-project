import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepo } from "./repositories/user.repo";
import { StoreModule } from "../store/store.module";
import { UserController } from "./user.controller";

@Module({
  providers: [UserRepo],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: "users" },
    ]),
    forwardRef(() => StoreModule),
  ],
  exports: [UserRepo],
  controllers: [UserController],
})
export class UserModule {}
