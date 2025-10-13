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
  passwordUserMaxAndMinLengthValidate,
  userIdLengthValidate,
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
import { STATUSES_CODE } from "../../core/types/constants";

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

    res.status(STATUSES_CODE.Success).send(allUsers);
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
    const {
      errorMessage: createdUserErrorMessage,
      data: createdUserData,
      status: createdUserStatus,
    } = await usersService.createUser(req.body);

    if (!createdUserData) {
      return res.status(createdUserStatus).send(createdUserErrorMessage);
    }

    const { data, status, errorMessage } =
      await usersQueryRepositories.getCurrentUserByObjectId({
        _id: createdUserData,
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.status(createdUserStatus).send(data);
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

    const { status, errorMessage } = await usersService.deleteUserById(_id);

    if (errorMessage) {
      return res.status(status).send(errorMessage);
    } else {
      return res.sendStatus(status);
    }
  },
);
