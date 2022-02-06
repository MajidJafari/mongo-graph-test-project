import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../configs/constants";
import { User, UserSchema } from "../user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreModule } from "../store/store.module";
import { UserModule } from "../user/user.module";

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
        UserModule,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
