import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { BaseApiError } from "../../components/base-api-error";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUserByUsernameAndPassword(
      username,
      password,
    );

    if (!user) {
      throw new BaseApiError(
        401,
        "UNAUTHORIZED",
        "username/password is invalid.",
        {
          username,
        },
      );
    }
    return user;
  }
}
