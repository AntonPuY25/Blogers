import { RequestParamsForDeleteUserProps } from "../../users/routers/types";

declare global {
   namespace Express {
    export interface Request {
      user: RequestParamsForDeleteUserProps;
    }
  }
}
