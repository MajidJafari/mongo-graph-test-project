import { BaseApiError } from "../components/base-api-error";

export class NotFound extends BaseApiError {
  constructor(message?: string) {
    super(404, "NOT_FOUND", message || "The requested entity not found.");
  }
}
