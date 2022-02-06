import { IUser } from "../user/schemas/user.schema";

export namespace Auth {
  export namespace Login {
    export namespace Request {
      export interface Body {
        username: string;
        password: string;
      }
    }
    export namespace Response {
      export interface Body {
        userInfo: IUser;
        loginInfo: {
          refreshToken: string;
          accessToken: string;
          expiresIn: number;
          tokenType: "bearer";
        };
      }
    }
  }
}
