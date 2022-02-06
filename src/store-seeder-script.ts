import { model, connect, Model } from "mongoose";
import { IStore, Store, StoreSchema } from "./store/schemas/store.schema";
import { constants } from "./configs/constants";
import { IUser, User, UserSchema } from "./user/schemas/user.schema";
import {
  adjectives,
  colors,
  starWars,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { ActivationStatus, UserTypes } from "./types/global";
import { hashSync } from "bcryptjs";

let storeModel: Model<IStore>;
let userModel: Model<IUser>;

connect(process.argv[2] || constants.MONGO_DB_URL)
  .then(() => {
    storeModel = model<IStore>(Store.name, StoreSchema, "stores");
    userModel = model<IUser>(User.name, UserSchema, "users");

    (async () => {
      await Promise.all([
        storeModel.deleteMany({}).exec(),
        userModel.deleteMany({}).exec(),
      ]);
      const root = await new storeModel({
        name: "Srbija",
        parentStore: null,
        createdAt: new Date(),
      }).save();

      console.log(
        "-------------The Following Stores Added Successfully-----------------",
      );

      await addUsers([root]);

      await storeRecursively(
        {
          Vojvodina: {
            "Severnobacki okrug": {
              Subotica: ["Radnja 1"],
            },
            "Juznobacki okrug": {
              "Novi Sad": {
                Detelinara: ["Radnja 2", "Radnja 3"],
                Liman: ["Radnja 4", "Radnja 5"],
              },
            },
          },
          "Grad Beograd": {
            "Novi Beograd": {
              Bezanija: ["Radnja 6"],
            },
            Vracar: {
              Neimar: ["Radnja 7"],
              "Crveni krst": ["Radnja 8", "Radnja 9"],
            },
          },
        },
        root._id,
      );
      console.log("--------------------------------------------");
      process.exit(0);
    })();
  })
  .catch((err: Error) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err,
    );
    process.exit(1);
  });

const storeRecursively = async (store: object, storeId: string) => {
  const childStoreNames = Array.isArray(store) ? store : Object.keys(store);

  const childStores = await Promise.all(
    childStoreNames.map(
      async (name) =>
        await new storeModel({
          name,
          parentStore: storeId,
          createdAt: new Date(),
        }).save(),
    ),
  );

  await addUsers(childStores);

  await Promise.all(
    childStores
      .filter(({ name }) => store[name])
      .map(async ({ _id, name }) => await storeRecursively(store[name], _id)),
  );
};

const addUsers = async (childStores: IStore[]) => {
  for (let i = 0; i < childStores.length; i++) {
    const childStore = childStores[i];
    const randomUserNumbers = Math.floor(Math.random() * 5) + 1;
    const users = await userModel.insertMany(
      [...Array(randomUserNumbers).keys()].map(() => {
        const randomString = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, starWars],
        });
        return {
          store: childStore._id,
          name: randomString,
          username: randomString,
          password: hashSync(randomString),
          createdAt: new Date(),
          status: ActivationStatus.Active,
          type: Object.values(UserTypes)[Math.floor(Math.random() * 10) % 2],
        };
      }),
    );
    console.log("=============================================");
    console.log("Store: ", childStore.name, "\n");
    console.log("Users:");
    console.log(
      users
        .map((user, index) => `${index + 1}.${user.name} => ${user.type}`)
        .join("\n"),
    );
    console.log("=============================================");
  }
};
