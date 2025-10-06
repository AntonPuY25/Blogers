import { UserLoginRequestProps } from "../routers/interface";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../users/service/constants";
import { authRepository } from "../repositories/auth-repository";

export const authService = {
  auth: async ({ password, loginOrEmail }: UserLoginRequestProps) => {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);

    return await authRepository.auth({
      loginOrEmail,
      hash,
      salt,
    });
  },
};
