import { UsersDataForCreateRequest } from "../routers/types";
import { ObjectId } from "mongodb";

export interface CreatedUserDataForBD
  extends Pick<UsersDataForCreateRequest, "email" | "login"> {
  userSalt: string;
  userHash: string;
  createdAt: string;
}

export interface CreatedUserDataAfterMappedForUi
  extends Omit<CreatedUserDataForBD, "userSalt" | "userHash"> {
  id: string;
}

export interface GetCurrentUserByObjectIdProps {
  _id: ObjectId;
}
