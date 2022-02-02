import { InternalServerError } from "./internal-server-error";

export class NotImplemented extends InternalServerError {
  constructor(details: { methodName: string; className: string }) {
    const { methodName, className } = details;
    super(details, `Method '${methodName}' is not implemented in '${className}'`);
  }
}
