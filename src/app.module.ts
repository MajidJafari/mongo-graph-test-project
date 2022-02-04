import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StoreModule } from "./store/store.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { constants } from "./configs/constants";

@Module({
  imports: [
    StoreModule,
    MongooseModule.forRoot(constants.MONGO_DB_URL),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
