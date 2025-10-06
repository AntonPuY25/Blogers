import { UsersDataForCreateRequest } from "../../users/routers/types";

export interface UserLoginRequestProps
  extends Pick<UsersDataForCreateRequest, "password"> {
  loginOrEmail: string;
}
