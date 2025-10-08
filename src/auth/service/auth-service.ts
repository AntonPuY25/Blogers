import { UserLoginRequestProps } from "../routers/interface";
import bcrypt from "bcrypt";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";
import { jwtService } from "../../jwtService/jwt-service";
import { authRepository } from "../repositories/auth-repository";

export const authService = {
  auth: async ({ password, loginOrEmail }: UserLoginRequestProps) => {
    const currentUserByLoginOrEmail =
      await usersQueryRepositories.getCurrentUserByLoginOrEmail(loginOrEmail);

    if (!currentUserByLoginOrEmail) {
      return false;
    }

    const salt = currentUserByLoginOrEmail.userSalt;
    const hash = bcrypt.hashSync(password, salt);

    const currentUser = await authRepository.auth({ salt, hash, loginOrEmail });

    if (currentUser) {
      return jwtService.createToken(currentUserByLoginOrEmail._id.toString());
    }

    return false;
  },
};
