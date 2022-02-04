import * as JoiRoot from "joi";
import { mongoId } from "./mongo-id";

export const Joi = JoiRoot.extend(mongoId);

declare global {
  namespace Joi {
    interface Root {
      mongoId(): JoiRoot.StringSchema;
    }
  }
}
