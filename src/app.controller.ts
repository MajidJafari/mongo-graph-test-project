import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { GenericValidatorPipe } from "./components/generic-validator-pipe";
import * as Joi from "joi";
import { AuthService } from "./auth/auth.service";
import { Auth } from "./types/inputs-outpus";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import { UserRepo } from "./user/repositories/user.repo";
import { IUser } from "./user/schemas/user.schema";

@Controller()
export class AppController {
  constructor(readonly authService: AuthService, private userRepo: UserRepo) {}

  @UseGuards(new LocalAuthGuard())
  @HttpCode(200)
  @Post("/auth/login")
  async login(
    @Request() req: { user: IUser; body: Auth.Login.Request.Body },
    @Body(
      new GenericValidatorPipe<{ username: string; password: string }>({
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required(),
      }),
    )
    _: Auth.Login.Request.Body,
  ): Promise<Auth.Login.Response.Body> {
    const loginInfo = this.authService.login(req.user);
    await this.userRepo.update<{ refreshToken: string }>(req.user._id, {
      refreshToken: loginInfo.refreshToken,
    });
    return {
      loginInfo,
      userInfo: req.user,
    };
  }
}
