import { PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { BaseApiError } from "./base-api-error";

export class GenericValidatorPipe<Dto> implements PipeTransform<Dto, Dto> {
  constructor(
    protected readonly validationSchema: { [key in keyof Dto]: Joi.Schema },
  ) {}
  transform(input: Dto): Dto {
    const result = Joi.object().keys(this.validationSchema).validate(input, {
      convert: true,
      abortEarly: false,
    });

    if (result.error) {
      throw new BaseApiError(
        422,
        "VALIDATION_ERROR",
        "Some inputs need correctness.",
        {
          errors: result.error.details.map((validationError) =>
            validationError.message.replace(/"/g, "`"),
          ),
        },
      );
    }

    const validDto = result.value;
    return Object.keys(validDto).reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue]: validDto[currentValue],
      }),
      {},
    ) as Dto;
  }
}
