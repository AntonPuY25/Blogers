import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../../core/types/basic-url-types";
import {
  RequestParamsForDeleteUserProps,
  UsersDataForCreateRequest,
} from "./types";
import {
  emailUserMaxAndMinLengthValidate,
  getUserValidationErrorsMiddieWare,
  loginUserMaxAndMinLengthValidate,
  passwordUserMaxAndMinLengthValidate, userIdLengthValidate
} from "../../core/middlewares/validate-users-middleware";
import { usersService } from "../service/user-service";
import { usersQueryRepositories } from "../repositories/users-query-repositories";
import { paginationAndSortingValidation } from "../../core/middlewares/sort-and-pagination-middleware";
import { SortFieldsForUsers } from "../../blogs/routers/sort-fields";
import {
  GetAppPostsPaginationWithSortWithSearchQuery,
  GetUsersPaginationWithSortWithSearchQuery,
} from "../../core/types/pagintaion-types";
import { superAdminGuardMiddleware } from "../../core/middlewares/auth-middleware";
import { setDefaultSortAndPaginationIfNotExist } from "../../blogs/repositories/helpers";
import { ObjectId } from "mongodb";

export const usersRouter = Router();

usersRouter.get(
  "/",
  superAdminGuardMiddleware,
  paginationAndSortingValidation(SortFieldsForUsers),
  getUserValidationErrorsMiddieWare,
  async (
    req: RequestWithQuery<Partial<GetUsersPaginationWithSortWithSearchQuery>>,
    res: Response,
  ) => {
    const queryParamsFirUsers = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as GetAppPostsPaginationWithSortWithSearchQuery;

    const allUsers =
      await usersQueryRepositories.getAllUsers(queryParamsFirUsers);

    res.status(200).send(allUsers);
  },
);

usersRouter.post(
  "/",
  superAdminGuardMiddleware,
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

usersRouter.delete(
  "/:userId",
  superAdminGuardMiddleware,
  userIdLengthValidate,
  getUserValidationErrorsMiddieWare,
  async (
    req: RequestWithParams<RequestParamsForDeleteUserProps>,
    res: Response,
  ) => {
    const userIdFromParams = req.params.userId;

    const _id = new ObjectId(userIdFromParams);

    const deletedUserCount = await usersService.deleteUserById(_id);

    if (deletedUserCount && deletedUserCount > 0) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
  },
);
