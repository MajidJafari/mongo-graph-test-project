import { ObjectId } from "bson";
import * as Joi from "joi";

function checkMongoId(id: string) {
  try {
    new ObjectId(id);
  } catch (e) {
    return false;
  }
  return true;
}

export function mongoId(joi: Joi.Root): Joi.Extension {
  return {
    type: "mongoId",
    base: joi.string(),
    validate(value: string, helpers: Joi.CustomHelpers) {
      if (checkMongoId(value)) {
        return value;
      } else {
        return { value, errors: helpers.error("mongoId.regex") };
      }
    },
  };
}
