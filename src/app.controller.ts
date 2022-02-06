import { Body, Controller, Post, Request } from "@nestjs/common";
import { NotImplemented } from "./exceptions/not-implemented";
import { GenericValidatorPipe } from "./components/generic-validator-pipe";
import * as Joi from "joi";
import { AuthService } from "./auth/auth.service";
import { Auth } from "./types/inputs-outpus";

@Controller()
export class AppController {
  constructor(readonly authService: AuthService) {}

  @Post("/auth/login")
  async login(
    @Body(
      new GenericValidatorPipe<{ username: string; password: string }>({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    )
    _: Auth.Login.Request.Body,
  ): Promise<Auth.Login.Response.Body> {
    throw new NotImplemented({
      className: this.constructor.name,
      methodName: "login",
    });
  }
}
