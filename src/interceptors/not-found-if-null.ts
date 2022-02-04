import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { NotFound } from "../exceptions/not-found";
import { Response } from "express";

@Injectable()
export class NotFoundIfNull implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    callHandler: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse<Response>();

    const statusCode = res.statusCode;

    return callHandler.handle().pipe(
      map((data) => {
        if (statusCode && !data) {
          throw new NotFound();
        } else if (data && statusCode === HttpStatus.NO_CONTENT) {
          data = undefined;
        }
        return data;
      }),
    );
  }
}
