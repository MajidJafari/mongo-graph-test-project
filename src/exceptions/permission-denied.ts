import { BaseApiError } from "../components/base-api-error";
import { HttpStatus } from "@nestjs/common";

export class PermissionDenied extends BaseApiError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      "PERMISSION_DENIED",
      "You are not allowed to do this action.",
    );
  }
}
