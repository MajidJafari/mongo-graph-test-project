import { Injectable } from "@nestjs/common";
import { UserRepo } from "../user/repositories/user.repo";
import { IUser } from "../user/schemas/user.schema";
import { compareSync } from "bcryptjs";
import { readFileSync } from "fs";
import { JwtService } from "@nestjs/jwt";
import { Auth } from "../types/inputs-outpus";
import { constants } from "../configs/constants";
import { v4 as uuid } from "uuid";
import * as ms from "ms";

@Injectable()
export class AuthService {
  constructor(readonly userRepo: UserRepo, private jwtService: JwtService) {}

  async validateUserByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<Omit<IUser, "password">> {
    const { password: userPassword, ...user } =
      (await this.userRepo.findOne({
        username,
      })) || ({} as IUser);
    if (user.username && compareSync(password, userPassword)) {
      return user as IUser;
    }
    return null;
  }

  login(user: IUser): Auth.Login.Response.Body["loginInfo"] {
    const { JWT_EXPIRES_IN } = constants;
    const privateKey = AuthService.privateKey;
    return {
      refreshToken: uuid(),
      accessToken: this.jwtService.sign(user, {
        privateKey,
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "RS512",
      }),
      expiresIn: Math.floor(ms(JWT_EXPIRES_IN) / 1000),
      tokenType: "bearer",
    };
  }

  static get privateKey() {
    return readFileSync("private.key", "utf8");
  }
}
