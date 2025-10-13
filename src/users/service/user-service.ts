import { UsersDataForCreateRequest } from "../routers/types";
import { getHashAndSaltForUserPassword } from "./helpers";
import { CreatedUserDataForBD } from "../repositories/interface";
import { userRepository } from "../repositories/user-repository";
import { ObjectId } from "mongodb";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";

export const usersService = {
  createUser: async ({ password, login, email }: UsersDataForCreateRequest) => {
    const { userSalt, userHash } = getHashAndSaltForUserPassword({
      password,
    });

    const createdUserDataForBd: CreatedUserDataForBD = {
      userHash,
      userSalt,
      email,
      login,
      createdAt: new Date().toISOString(),
    };

    const createdUserObjectId =
      await userRepository.createUser(createdUserDataForBd);

    if (!createdUserObjectId) {
      return {
        status: STATUSES_CODE.BadRequest,
        errorMessage: ERRORS_MESSAGES.createdUserErrorFormMongo,
        data: null,
      } as ResultObject;
    }

    return {
      status: STATUSES_CODE.Created,
      data: createdUserObjectId,
    } as ResultObject<ObjectId>;
  },

  deleteUserById: async (_id: ObjectId) => {
    const deletedUserCount = await userRepository.deleteUserById(_id);

    if(!deletedUserCount) {
      return {
        status: STATUSES_CODE.NotFound,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentUserById,
        data: null,
      } as ResultObject;
    }

    return  {
      status: STATUSES_CODE.NoContent,
      data: null,
    } as ResultObject;
  },
};
