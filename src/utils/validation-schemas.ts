import { GenericValidatorPipe } from "../components/generic-validator-pipe";
import { Joi } from "../lib/custom-joi";
import { UserTypes } from "../types/global";

export const getIdValidationSchema = () =>
  new GenericValidatorPipe({
    id: Joi.mongoId().required(),
  });

export const getUserTypeVlidationSchema = () =>
  new GenericValidatorPipe({
    type: Joi.string()
      .valid(...Object.values(UserTypes))
      .required(),
  });
