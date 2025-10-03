import { GeneratePasswordWithHashAndSaltProps } from "./types";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constants";

export const getHashAndSaltForUserPassword = ({
  password,
}: GeneratePasswordWithHashAndSaltProps) => {
  const userSalt = bcrypt.genSaltSync(SALT_ROUNDS);

  const userHash = bcrypt.hashSync(password, userSalt);

  return {
    userHash,
    userSalt
  }
};
