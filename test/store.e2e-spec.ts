import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../src/configs/constants";
import { testUser } from "../src/configs/test-configs";

describe("StoreController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(constants.MONGO_DB_URL_TEST), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const {
      body: { loginInfo },
    } = await request(app.getHttpServer()).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    accessToken = loginInfo.accessToken;
  });

  describe("/stores/:id/users/:type (GET)", () => {
    it("should throw an error for wrong params", async () => {
      return request(app.getHttpServer())
        .get("/stores/not-a-mongo-db-id/users/not-a-user-type")
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .send()
        .expect(422);
    });
  });
});
