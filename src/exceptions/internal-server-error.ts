import { BaseApiError } from "../components/base-api-error";
import { Dictionary } from "../types/global";

export class InternalServerError extends BaseApiError {
  constructor(details?: Dictionary, reason?: string) {
    super(
      500,
      "INTERNAL_SERVER_ERROR",
      "Something unexpected occurred! Sorry for inconvenience :(",
      details,
      reason,
    );
  }
}
