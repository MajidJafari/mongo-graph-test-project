import { Injectable } from "@nestjs/common";
import { UserRepo } from "../user/repositories/user.repo";

@Injectable()
export class AuthService {
  constructor(readonly userRepo: UserRepo) {}
}
