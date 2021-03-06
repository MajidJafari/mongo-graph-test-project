import { Dictionary } from "../types/global";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { HttpException } from "@nestjs/common";

export class BaseApiError extends HttpException {
  constructor(
    public readonly httpCode: ErrorHttpStatusCode,
    public readonly name: string,
    public readonly message: string,
    public readonly details?: Dictionary,
    public readonly reason?: string,
  ) {
    super(message, httpCode);
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);

    reason &&
      console.log(
        "xxxxxxxxxxxxxxxxxxxxxxxx ERROR OCCURRED xxxxxxxxxxxxxxxxxxxxxxxx",
      );
    reason && console.table({ reason });
  }

  getResponse() {
    return {
      status: this.httpCode,
      name: this.name,
      message: this.message,
      details: this.details,
    };
  }
}
