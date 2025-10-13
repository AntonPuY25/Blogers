import { Response, Router } from "express";
import { RequestWithBody } from "../../core/types/basic-url-types";
import { UserLoginRequestProps } from "./interface";
import { authService } from "../service/auth-service";
import {
  getUserValidationErrorsMiddieWare,
  loginOrEmailUserMaxAndMinLengthValidate,
  passwordUserMaxAndMinLengthValidate,
} from "../../core/middlewares/validate-users-middleware";
import { accessTokenMiddlewareGuard } from "../../guards/access-token-guard";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";
import { ObjectId } from "mongodb";

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordUserMaxAndMinLengthValidate,
  loginOrEmailUserMaxAndMinLengthValidate,
  getUserValidationErrorsMiddieWare,
  async (req: RequestWithBody<UserLoginRequestProps>, res: Response) => {
    const { status, errorMessage, data } = await authService.auth(req.body);

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.status(status).send({
      accessToken: data,
    });
  },
);

authRouter.get(
  "/me",
  accessTokenMiddlewareGuard,
  async (req: RequestWithBody<UserLoginRequestProps>, res: Response) => {
    const { status, errorMessage, data } =
      await usersQueryRepositories.getCurrentUserByObjectId({
        _id: new ObjectId(req.user.userId),
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.sendStatus(status);
  },
);
