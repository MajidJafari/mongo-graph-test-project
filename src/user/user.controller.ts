import { Controller, Post } from "@nestjs/common";
import { NotImplemented } from "../exceptions/not-implemented";

@Controller("users")
export class UserController {
  @Post()
  async create() {
    throw new NotImplemented({
      methodName: "create",
      className: this.constructor.name,
    });
  }
}
