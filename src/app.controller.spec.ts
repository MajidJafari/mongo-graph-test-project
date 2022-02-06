import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "./configs/constants";
import { User, UserSchema } from "./user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreModule } from "./store/store.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        MongooseModule.forRoot(constants.MONGO_DB_URL_TEST),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema, collection: "users" },
        ]),
        forwardRef(() => StoreModule),
        UserModule,
        AuthModule,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("AUTH", () => {
    it("should return login info", async () => {
      const { username, password, name } =
        await appController.authService.userRepo.findOne({});

      const { loginInfo, userInfo } = await appController.login({
        username,
        password,
      });

      expect(userInfo).toHaveProperty("name");
      expect(userInfo.name).toEqual(name);
      expect(loginInfo).toHaveProperty("accessToken");
      expect(loginInfo.accessToken).toMatch(/ey*/);
    });
  });
});
