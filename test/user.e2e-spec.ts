import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { UserCreateDto } from "../src/user/dto/user.create.dto";
import { UserTypes } from "../src/types/global";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../src/configs/constants";
import { UserUpdateDto } from "../src/user/dto/user.update.dto";

describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(constants.MONGO_DB_URL_TEST), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/users (POST)", () => {
    it("should throw an error for wrong data input", async () => {
      const createDto: UserCreateDto = {
        name: "Majid Jafari 2",
        type: UserTypes.Employee,
        store: "some-unvalidated-mongo-id",
      };
      return request(app.getHttpServer())
        .post("/users/")
        .send(createDto)
        .expect(422);
    });
  });

  describe("/users/:id (PUT)", () => {
    it("should throw an error for wrong data input", () => {
      const updateDto: UserUpdateDto = {
        name: "Majid Jafari 3",
      };
      return request(app.getHttpServer())
        .put("/users/some-unvalidated-mongo-id")
        .send(updateDto)
        .expect(422);
    });

    it("should throw proper error for non-existent entity", () => {
      const updateDto: UserUpdateDto = {
        name: "Majid Jafari 3",
      };
      return request(app.getHttpServer())
        .put("/users/61fad128dedc69e21f645872")
        .send(updateDto)
        .expect(404);
    });
  });

  describe("/users/:id (GET)", () => {
    it("should throw an error for wrong data input", () => {
      return request(app.getHttpServer())
        .get("/users/some-unvalidated-mongo-id")
        .send()
        .expect(422);
    });

    it("should throw proper error for non-existent entity", () => {
      return request(app.getHttpServer())
        .get("/users/61fad128dedc69e21f645872")
        .send()
        .expect(404);
    });
  });

  describe("/users/:id (DELETE)", () => {
    it("should throw an error for wrong data input", () => {
      return request(app.getHttpServer())
        .delete("/users/some-unvalidated-mongo-id")
        .send()
        .expect(422);
    });

    it("should throw proper error for non-existent entity", () => {
      return request(app.getHttpServer())
        .delete("/users/61fad128dedc69e21f645872")
        .send()
        .expect(404);
    });
  });
});
