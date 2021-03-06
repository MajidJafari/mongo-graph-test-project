import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "./configs/constants";
import { User, UserSchema } from "./user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreModule } from "./store/store.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { createRequest } from "node-mocks-http";
import { Auth } from "./types/inputs-outpus";

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
      const user = await appController.authService.userRepo.findOne({});
      const { username, password, name } = user;

      const body: Auth.Login.Request.Body = {
        username,
        password,
      };
      const { loginInfo, userInfo } = await appController.login(
        createRequest({ body, user }) as any,
        body,
      );

      expect(userInfo).toHaveProperty("name");
      expect(userInfo.name).toEqual(name);
      expect(loginInfo).toHaveProperty("accessToken");
      expect(loginInfo.accessToken).toMatch(/ey*/);
    });
  });
});
