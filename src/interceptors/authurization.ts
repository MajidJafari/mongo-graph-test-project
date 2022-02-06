import {
  CallHandler,
  ExecutionContext,
  flatten,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { IUser } from "../user/schemas/user.schema";
import { UserTypes } from "../types/global";
import { StoreRepo } from "../store/repositories/store.repo";
import { PermissionDenied } from "../exceptions/permission-denied";
import { map } from "rxjs";

@Injectable()
export class Authorization implements NestInterceptor {
  constructor(private storeRepo: StoreRepo) {}
  async intercept(context: ExecutionContext, callHandler: CallHandler) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request & { user: IUser }>();
    const res = httpContext.getResponse<Response>();

    const { id, type } = req.params;
    const { _id, store, type: role } = req.user;
    const getOwnUsersPromises: Promise<{ users: IUser[] }>[] = [
      this.storeRepo.getOwnUsers(store, UserTypes.Employee),
    ];
    const getDescendantUsersPromises: Promise<{ users: IUser[] }[]>[] = [
      this.storeRepo.getDescendantUsers(store, UserTypes.Employee),
    ];

    if (type === UserTypes.Manager) {
      if (role === UserTypes.Employee) {
        throw new PermissionDenied();
      } else if (role === UserTypes.Manager) {
        getOwnUsersPromises.push(
          this.storeRepo.getOwnUsers(store, UserTypes.Manager),
        );
        getDescendantUsersPromises.push(
          this.storeRepo.getDescendantUsers(store, UserTypes.Manager),
        );
      }
    }

    const siblingUsers = flatten(
      (await Promise.all(getOwnUsersPromises)).map((item) => item.users),
    );
    const descendantUsers = flatten(
      (await Promise.all(getDescendantUsersPromises))
        .map((item) => item.map((item) => item.users))
        .reduce(
          (previousValue, currentValue) => previousValue.concat(currentValue),
          [],
        ),
    );

    const ids = [_id]
      .concat(siblingUsers)
      .concat(descendantUsers)
      .map<string>((item) => item._id.toString());
    const stores = [{ store }]
      .concat(siblingUsers)
      .concat(descendantUsers)
      .map<string>((item) => item.store.toString());

    if ((!type && !ids.includes(id)) || (type && !stores.includes(id))) {
      throw new PermissionDenied();
    }

    return callHandler.handle().pipe(map((data) => data));
  }
}
