import { Response, Router } from "express";
import { RequestWithBody } from "../../core/types/basic-url-types";
import { UserLoginRequestProps } from "./interface";
import { authService } from "../service/auth-service";
import {
  getUserValidationErrorsMiddieWare,
  loginOrEmailUserMaxAndMinLengthValidate,
  passwordUserMaxAndMinLengthValidate,
} from "../../core/middlewares/validate-users-middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordUserMaxAndMinLengthValidate,
  loginOrEmailUserMaxAndMinLengthValidate,
  getUserValidationErrorsMiddieWare,
  async (req: RequestWithBody<UserLoginRequestProps>, res: Response) => {
    const isLoggedUser = await authService.auth(req.body);

    if (isLoggedUser) {
      return res.sendStatus(204);
    }

    return res.sendStatus(401);
  },
);
