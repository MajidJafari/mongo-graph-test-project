import { model, connect } from "mongoose";
import { IStore, Store, StoreSchema } from "./store/schemas/store.schema";
import { constants } from "./configs/constants";

connect(process.argv[2] || constants.MONGO_DB_URL)
  .then(() => {
    const storeModel = model<IStore>(Store.name, StoreSchema, "stores");
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

      console.log(childStoreNames.join("\n"));

      await Promise.all(
        childStores
          .filter(({ name }) => store[name])
          .map(
            async ({ _id, name }) => await storeRecursively(store[name], _id),
          ),
      );
    };

    (async () => {
      await storeModel.deleteMany({}).exec();
      const root = await new storeModel({
        name: "Srbija",
        parentStore: null,
        createdAt: new Date(),
      }).save();

      console.log("-------------Stores Added Successfully-----------------");
      console.log("Srbija");

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
