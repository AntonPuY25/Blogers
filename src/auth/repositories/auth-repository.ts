import { usersCollection } from "../../db/db";
import { authServiceLoginProps } from "./interface";

export const authRepository = {
  auth: async ({ salt, hash, loginOrEmail }: authServiceLoginProps) => {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      userHash: hash,
      userSalt: salt,
    });
  },
};
