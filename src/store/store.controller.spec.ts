import { Test, TestingModule } from "@nestjs/testing";
import { StoreController } from "./store.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { constants } from "../configs/constants";
import { IUser } from "../user/schemas/user.schema";
import { forwardRef } from "@nestjs/common";
import { StoreRepo } from "./repositories/store.repo";
import { UserModule } from "../user/user.module";
import { IStore, Store, StoreSchema } from "./schemas/store.schema";
import { UserTypes } from "../types/global";
import { ObjectId } from "bson";

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
    let employees: { data: { ownUsers: IUser[] } };
    it("should retrieve an array of users", async () => {
      const store = await controller.storeRepo.findOne({});
      employees = await controller.getUsers({
        id: store._id,
        type: UserTypes.Employee,
      });

      expect(employees).toHaveProperty("data");
      expect(employees.data).toBeInstanceOf(Object);
      expect(employees.data.ownUsers).toBeInstanceOf(Array);

      if (employees.data.ownUsers[0]) {
        expect(employees.data.ownUsers[0]).toHaveProperty("type");
        expect(employees.data.ownUsers[0].type).toEqual(UserTypes.Employee);
      }
    });

    it("should not contain any manager", () => {
      const isThereManager = employees.data.ownUsers.reduce(
        (previousValue, currentValue) =>
          previousValue || currentValue.type === UserTypes.Manager,
        false,
      );
      expect(isThereManager).toBe(false);
    });

    describe("Retrieve All Employees of a Node", () => {
      let store: IStore & { childStores: { _id: ObjectId[] }[] };
      let employees: { data: { ownUsers: IUser[]; descendantUsers: IUser[] } };

      it("should contain own users", async () => {
        store = (
          await controller.storeRepo.aggregate().lookup({
            from: "stores",
            localField: "_id",
            foreignField: "parentStore",
            pipeline: [
              {
                $match: {
                  status: "ACTIVE",
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "childStores",
          })
        )[0];

        employees = await controller.getUsers<true>(
          {
            id: store._id,
            type: UserTypes.Employee,
          },
          {
            includeDescendants: true,
          },
        );

        expect(employees).toHaveProperty("data");
        expect(employees.data).toBeInstanceOf(Object);

        expect(employees.data).toHaveProperty("ownUsers");
        expect(employees.data.ownUsers).toBeInstanceOf(Array);
        if (employees.data.ownUsers[0]) {
          expect(employees.data.ownUsers[0]).toHaveProperty("store");
          expect(employees.data.ownUsers[0].store).toEqual(store._id);
        }
      });

      it("should contain descendant users", () => {
        expect(employees.data).toHaveProperty("descendantUsers");
        expect(employees.data.descendantUsers).toBeInstanceOf(Array);
        if (employees.data.descendantUsers[0]) {
          expect(employees.data.descendantUsers[0]).toHaveProperty("store");
          expect(
            store.childStores
              .map((item) => item._id.toString())
              .includes(employees.data.descendantUsers[0].store.toString()),
          ).toBe(true);
          expect(employees.data.descendantUsers[0]).toHaveProperty("type");
          expect(employees.data.descendantUsers[0].type).toEqual(
            UserTypes.Employee,
          );
        }
      });
    });
  });
});
