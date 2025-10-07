import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../core/settings/settings";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    const options: SignOptions = {
      expiresIn: SETTINGS.AC_TIME as SignOptions['expiresIn'],
    };
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, options);
  },
};
