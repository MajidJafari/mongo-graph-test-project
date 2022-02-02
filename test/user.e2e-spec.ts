import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { UsercreateDto } from "../src/user/dto/usercreate.dto";
import { ActivationStatus, UserTypes } from "../src/types/global";

describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users (POST)", () => {
    const createDto: UsercreateDto = {
      name: "Majid Jafari",
      type: UserTypes.Employee,
      store: "61fad128dedc69e21f645872",
    };
    return request(app.getHttpServer())
      .post("/users/")
      .send(createDto)
      .expect(201)
      .expect({ ...createDto, status: ActivationStatus.Active });
  });
});
