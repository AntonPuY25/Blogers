import { UserLoginRequestProps } from "../routers/interface";
import bcrypt from "bcrypt";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";
import { jwtService } from "../../jwtService/jwt-service";
import { authRepository } from "../repositories/auth-repository";
import { ResultObject } from "../../core/types/result-object";
import { ERRORS_MESSAGES, STATUSES_CODE } from "../../core/types/constants";
import {
  UserRegistrationServiceForBd,
  UserRegistrationServiceProps,
} from "./interface";
import { getHashAndSaltForUserPassword } from "../../users/service/helpers";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { userRepository } from "../../users/repositories/user-repository";
import { nodeMailerService } from "../../nodeMailer/nodeMailerService/node-mailer-service";

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
        data: await jwtService.createToken(
          currentUserByLoginOrEmail._id.toString(),
        ),
        status: STATUSES_CODE.Success,
      } as ResultObject<string>;
    }

    return {
      status: STATUSES_CODE.Unauthorized,
      errorMessage: ERRORS_MESSAGES.notFoundCurrentUserById,
    } as ResultObject;
  },

  registration: async ({
    password,
    login,
    email,
  }: UserRegistrationServiceProps) => {
    const currentUserByEmail =
      await usersQueryRepositories.getCurrentUserByEmail(email);

    console.log(currentUserByEmail,'currentUserByEmail');

    if (currentUserByEmail) {
      return {
        status: STATUSES_CODE.BadRequest,
        extensions: {
          field: "Email",
          message: "User with such email is already registered",
        },
      } as ResultObject;
    }

    const { userSalt, userHash } = getHashAndSaltForUserPassword({
      password,
    });

    const createdUserDataForBd: UserRegistrationServiceForBd = {
      userHash,
      userSalt,
      email,
      login,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    await userRepository.registerUser(createdUserDataForBd);

    try {
      await nodeMailerService.sendRegisterMail({
        code: createdUserDataForBd.emailConfirmation.confirmationCode,
        email,
      });
    } catch (e) {
      console.error(e);

      return {
        status: STATUSES_CODE.BadRequest,
        extensions: {
          field: "Email",
          message: "Something went wrong with email sending",
        },
      } as ResultObject<string>;
    }

    return  {
      status: STATUSES_CODE.NoContent,
    } as ResultObject;
  },
};
