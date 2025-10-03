import { UsersDataForCreateRequest } from "../routers/types";
import { getHashAndSaltForUserPassword } from "./helpers";
import { CreatedUserDataForBD } from "../repositories/interface";
import { userRepository } from "../repositories/user-repository";

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
};
