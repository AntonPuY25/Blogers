import { UserLoginRequestProps } from "../routers/interface";
import bcrypt from "bcrypt";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";

export const authService = {
  auth: async ({ password, loginOrEmail }: UserLoginRequestProps) => {
    const currentUserByLoginOrEmail =
      await usersQueryRepositories.getCurrentUserByLoginOrEmail(loginOrEmail);

    if (!currentUserByLoginOrEmail) {
      return false;
    }

    const salt = currentUserByLoginOrEmail.userSalt;
    const hash = bcrypt.hashSync(password, salt);

    return hash === currentUserByLoginOrEmail.userHash;
  },
};
