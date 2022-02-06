import { Test, TestingModule } from "@nestjs/testing";
import { StoreController } from "./store.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../configs/constants";
import { IUser } from "../user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { UserModule } from "../user/user.module";
import { Store, StoreSchema } from "./schemas/store.schema";
import { UserTypes } from "../types/global";

describe("StoreController", () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [StoreRepo],
      imports: [
        MongooseModule.forRoot(constants.MONGO_DB_URL_TEST),
        MongooseModule.forFeature([
          { name: Store.name, schema: StoreSchema, collection: "stores" },
        ]),
        forwardRef(() => UserModule),
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Retrieve All Employees of a Node", () => {
    let employees = {} as { data: IUser[] };
    it("should retrieve an array of users", async () => {
      const store = await controller.storeRepo.findOne({});
      employees = await controller.getUsers({
        id: store._id,
        type: UserTypes.Employee,
      });

      expect(employees).toHaveProperty("data");
      expect(employees.data).toBeInstanceOf(Array);

      if (employees.data[0]) {
        expect(employees.data[0]).toHaveProperty("type");
        expect(employees.data[0].type).toEqual(UserTypes.Employee);
      }
    });

    it("should not contain any manager", () => {
      const isThereManager = employees.data.reduce(
        (previousValue, currentValue) =>
          previousValue || currentValue.type === UserTypes.Manager,
        false,
      );
      expect(isThereManager).toBe(false);
    });
  });
});
