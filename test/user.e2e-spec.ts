import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { UserCreateDto } from "../src/user/dto/user.create.dto";
import { UserTypes } from "../src/types/global";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../src/configs/constants";

describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(constants.MONGO_DB_URL_TEST), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users (POST)", () => {
    const createDto: UserCreateDto = {
      name: "Majid Jafari",
      type: UserTypes.Employee,
      store: "61fad128dedc69e21f645872",
    };
    return request(app.getHttpServer())
      .post("/users/")
      .send(createDto)
      .expect(201);
  });
});
