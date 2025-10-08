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
    const jwtToken = await authService.auth(req.body);

    if (!jwtToken) {
      return res.sendStatus(401);
    }

    res.status(200).send({
      accessToken: jwtToken,
    });
  },
);

authRouter.get(
  "/me",
  accessTokenMiddlewareGuard,
  async (req: RequestWithBody<UserLoginRequestProps>, res: Response) => {
    const currentUser = await usersQueryRepositories.getCurrentUserByObjectId({
      _id: new ObjectId(req.user.userId),
    });

    res.sendStatus(201);
  },
);
