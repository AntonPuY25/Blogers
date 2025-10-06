import { UsersDataForCreateRequest } from "../routers/types";
import { getHashAndSaltForUserPassword } from "./helpers";
import { CreatedUserDataForBD } from "../repositories/interface";
import { userRepository } from "../repositories/user-repository";
import { ObjectId } from "mongodb";

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

   return await userRepository.createUser(createdUserDataForBd);
  },

  deleteUserById: async (_id: ObjectId) => {

    return await userRepository.deleteUserById(_id);

  }
};
