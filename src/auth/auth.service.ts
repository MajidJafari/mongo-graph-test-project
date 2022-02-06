import { Injectable } from "@nestjs/common";
import { UserRepo } from "../user/repositories/user.repo";
import { IUser } from "../user/schemas/user.schema";
import { compareSync } from "bcryptjs";
import { readFileSync } from "fs";
import { JwtService } from "@nestjs/jwt";
import { NotImplemented } from "../exceptions/not-implemented";
import { Auth } from "../types/inputs-outpus";

@Injectable()
export class AuthService {
  constructor(readonly userRepo: UserRepo, private jwtService: JwtService) {}

  async validateUserByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<Omit<IUser, "password">> {
    const { password: userPassword, ...user } = await this.userRepo.findOne({
      username,
    });
    if (user && compareSync(password, userPassword)) {
      return user as IUser;
    }
    return null;
  }

  login(user: IUser): Auth.Login.Response.Body["loginInfo"] {
    throw new NotImplemented({
      className: this.constructor.name,
      methodName: "login",
    });
  }

  static get privateKey() {
    return readFileSync("private.key", "utf8");
  }
}
