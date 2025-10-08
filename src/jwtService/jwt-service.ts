import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../core/settings/settings";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    const options: SignOptions = {
      expiresIn: SETTINGS.AC_TIME as SignOptions['expiresIn'],
    };
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, options);
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};
