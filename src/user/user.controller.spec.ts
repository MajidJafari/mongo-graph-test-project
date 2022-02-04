import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./schemas/user.schema";
import { UserTypes } from "../types/global";
import { UserRepo } from "./repositories/user.repo";
import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef } from "@nestjs/common";
import { StoreModule } from "../store/store.module";
import { constants } from "../configs/constants";
import { UserFindDto } from "./dto/user.find.dto";

describe("UserController", () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserRepo],
      imports: [
        MongooseModule.forRoot(constants.MONGO_DB_URL_TEST),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema, collection: "users" },
        ]),
        forwardRef(() => StoreModule),
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should be created", async () => {
    const userName = "Majid Jafari";
    const createdUser = await (async () =>
      await controller.create({
        name: userName,
        type: UserTypes.Employee,
        store: "61fad128dedc69e21f645872",
      }))();

    expect(createdUser).toHaveProperty("_id");
    expect(
      await controller.userRepo.findOne({ name: { $regex: "Majid" } }),
    ).toEqual(createdUser);
  });

  it("should be updated", async () => {
    const updatedUserName = "Majid Jafari 3";
    const currentUser = await controller.userRepo.findOne<UserFindDto>({
      name: { $regex: "Majid" },
    });

    expect(
      (
        await controller.update(currentUser._id, {
          name: updatedUserName,
        })
      ).name,
    ).toEqual(updatedUserName);

    const updatedUser = await controller.userRepo.findById(currentUser._id);
    expect(currentUser.name).not.toEqual(updatedUser.name);
  });

  it("should be retrieved", async () => {
    const retrievedUser = await controller.userRepo.findOne<UserFindDto>({
      name: { $regex: "Majid" },
    });

    expect(await controller.retrieve(retrievedUser._id)).toEqual(retrievedUser);
  });

  afterAll(async () => {
    await controller.userRepo.deleteMany({});
  });
});
