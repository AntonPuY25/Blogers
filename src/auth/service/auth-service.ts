import { UserLoginRequestProps } from "../routers/interface";
import bcrypt from "bcrypt";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";
import { jwtService } from "../../jwtService/jwt-service";
import { authRepository } from "../repositories/auth-repository";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";

export const authService = {
  auth: async ({ password, loginOrEmail }: UserLoginRequestProps) => {
    const currentUserByLoginOrEmail =
      await usersQueryRepositories.getCurrentUserByLoginOrEmail(loginOrEmail);

    if (!currentUserByLoginOrEmail) {
      return {
        status: STATUSES_CODE.Unauthorized,
        errorMessage: ERRORS_MESSAGES.notFoundCurrentUserById,
      } as ResultObject;
    }

    const salt = currentUserByLoginOrEmail.userSalt;
    const hash = bcrypt.hashSync(password, salt);

    const currentUser = await authRepository.auth({ salt, hash, loginOrEmail });

    if (currentUser) {
      return {
        data: await jwtService.createToken(currentUserByLoginOrEmail._id.toString()),
        status: STATUSES_CODE.Success,
      } as ResultObject<string>;
    }

    return {
      status: STATUSES_CODE.Success,
      errorMessage: ERRORS_MESSAGES.notFoundCurrentUserById,
    } as ResultObject;
  },
};
