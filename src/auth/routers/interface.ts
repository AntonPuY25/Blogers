import { UsersDataForCreateRequest } from "../../users/routers/types";

export interface UserLoginRequestProps
  extends Pick<UsersDataForCreateRequest, "password"> {
  loginOrEmail: string;
}

export interface UserRegistrationPayload {
  login: string;
  password: string;
  email: string;
}

export interface EmailConfirmationPayload {
  code: string;
}

export interface EmailResendingPayload {
  email: string;
}
