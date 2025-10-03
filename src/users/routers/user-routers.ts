import { Response, Router } from "express";
import { RequestWithBody } from "../../core/types/basic-url-types";
import { UsersDataForCreateRequest } from "./types";
import {
  emailUserMaxAndMinLengthValidate,
  getUserValidationErrorsMiddieWare,
  loginUserMaxAndMinLengthValidate,
  passwordUserMaxAndMinLengthValidate,
} from "../../core/middlewares/validate-users-middleware";
import { usersService } from "../service/user-service";
import { usersQueryRepositories } from "../repositories/users-query-repositories";

export const usersRouter = Router();

usersRouter.post(
  "/",
  loginUserMaxAndMinLengthValidate,
  passwordUserMaxAndMinLengthValidate,
  emailUserMaxAndMinLengthValidate,
  getUserValidationErrorsMiddieWare,
  async (req: RequestWithBody<UsersDataForCreateRequest>, res: Response) => {
    const createdUserObjectId = await usersService.createUser(req.body);

    if (!createdUserObjectId) {
      return res.sendStatus(400);
    }

    const createdUser = await usersQueryRepositories.getCurrentUserByObjectId({
      _id: createdUserObjectId,
    });

    if (!createdUser) {
      return res.sendStatus(400);
    }

    res.status(201).send(createdUser);
  },
);
