import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../src/configs/constants";

describe("StoreController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(constants.MONGO_DB_URL_TEST), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/stores/:id/users/:type (GET)", () => {
    it("should throw an error for wrong params", async () => {
      return request(app.getHttpServer())
        .get("/stores/not-a-mongo-db-id/users/not-a-user-type")
        .send()
        .expect(422);
    });
  });
});
