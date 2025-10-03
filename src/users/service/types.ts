import { UsersDataForCreateRequest } from "../routers/types";

export interface GeneratePasswordWithHashAndSaltProps
  extends Pick<UsersDataForCreateRequest, "password"> {}
