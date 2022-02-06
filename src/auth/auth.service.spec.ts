import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../configs/constants";
import { User, UserSchema } from "../user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreModule } from "../store/store.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "./auth.module";
import { JwtModule } from "@nestjs/jwt";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [
        MongooseModule.forRoot(constants.MONGO_DB_URL_TEST),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema, collection: "users" },
        ]),
        forwardRef(() => StoreModule),
        AuthModule,
        UserModule,
        JwtModule.register({
          privateKey: AuthService.privateKey,
          signOptions: {
            algorithm: "RS512",
            expiresIn: constants.JWT_EXPIRES_IN,
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return proper login info", async () => {
    const user = await service.userRepo.findOne({});
    const loginInfo = service.login(user);
    expect(loginInfo).toHaveProperty("accessToken");
    expect(loginInfo).toHaveProperty("expiresIn");
    expect(loginInfo.tokenType).toEqual("bearer");
  });
});
