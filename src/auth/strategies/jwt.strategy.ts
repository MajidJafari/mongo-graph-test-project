import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { IUser } from "../../user/schemas/user.schema";
import { BaseApiError } from "../../components/base-api-error";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      ignoreExpiration: false,
      secretOrKey: AuthService.publicKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IUser) {
    const { password, ...user } = await this.authService.validateByUserId(
      payload._id,
    );
    if (!user._id) {
      throw new BaseApiError(401, "UNAUTHORIZED", "payload is invalid.", {
        userId: payload._id,
      });
    }
    return user;
  }
}
