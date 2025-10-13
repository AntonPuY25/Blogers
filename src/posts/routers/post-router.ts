import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../core/types/basic-url-types";
import {
  CreatePostRequest,
  GetCurrentPostId,
  UpdatePostData,
} from "../../core/types/routers-types";
import { superAdminGuardMiddleware } from "../../core/middlewares/auth-middleware";
import {
  blogIdPostRequiredValidate,
  commentContentRequiredValidate,
  contentPostMaxLengthValidate,
  getPostsValidationErrorsMiddieWare,
  shortDescriptionPostMaxLengthValidate,
  titlePostMaxLengthValidate,
} from "../../core/middlewares/validate-posts-middleware";
import { postService } from "../service/post-service";
import { paginationAndSortingValidation } from "../../core/middlewares/sort-and-pagination-middleware";
import {
  SortFields,
  SortFieldsForComments,
} from "../../blogs/routers/sort-fields";
import {
  GetAppBlogsPaginationWithSortWithSearchQuery,
  GetAppPostsPaginationWithSortWithSearchQuery,
  PaginationAndSorting,
} from "../../core/types/pagintaion-types";
import { setDefaultSortAndPaginationIfNotExist } from "../../blogs/repositories/helpers";
import { postQueryRepository } from "../repositories/post-query-repository";
import { accessTokenMiddlewareGuard } from "../../guards/access-token-guard";
import {
  CreateCommentForPostProps,
  GetPaginationAndSortForPostsAndComments,
} from "./interface";
import { usersQueryRepositories } from "../../users/repositories/users-query-repositories";
import { ObjectId } from "mongodb";
import { commentsService } from "../../comments/commentsService/comments-service";
import { commentsQueryRepositories } from "../../comments/commentsRepository/comments-query-repository";
import { STATUSES_CODE } from "../../core/types/constants";

export const postRouter = Router();

postRouter.get(
  "/",
  paginationAndSortingValidation(SortFields),
  getPostsValidationErrorsMiddieWare,
  async (
    req: RequestWithQuery<
      Partial<GetAppPostsPaginationWithSortWithSearchQuery>
    >,
    res: Response,
  ) => {
    const queryParamsForGetBlogs = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as GetAppBlogsPaginationWithSortWithSearchQuery;

    const allPosts = await postQueryRepository.getAllPosts(
      queryParamsForGetBlogs,
    );

    res.status(STATUSES_CODE.Success).send(allPosts);
  },
);

postRouter.post(
  "/",
  superAdminGuardMiddleware,
  titlePostMaxLengthValidate,
  shortDescriptionPostMaxLengthValidate,
  contentPostMaxLengthValidate,
  blogIdPostRequiredValidate,
  getPostsValidationErrorsMiddieWare,
  async (req: RequestWithBody<CreatePostRequest>, res: Response) => {
    const { status, data, errorMessage } = await postService.createNewPost({
      ...req.body,
    });

    if (!data) {
      return res.status(status).send({
        errorsMessages: [
          {
            message: errorMessage,
            field: "blogId",
          },
        ],
      });
    }

    res.status(status).send(data);
  },
);

postRouter.get(
  "/:postId",
  async (req: RequestWithParams<GetCurrentPostId>, res: Response) => {
    const currentPostId = req.params.postId || "";

    const { status, errorMessage, data } =
      await postQueryRepository.getPostById(currentPostId);

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.status(status).send(data);
  },
);

postRouter.put(
  "/:postId",
  superAdminGuardMiddleware,
  titlePostMaxLengthValidate,
  shortDescriptionPostMaxLengthValidate,
  contentPostMaxLengthValidate,
  blogIdPostRequiredValidate,
  getPostsValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<GetCurrentPostId, UpdatePostData>,
    res: Response,
  ) => {
    const currentPostId = req.params.postId || "";
    const { content, shortDescription, title, blogId } = req.body;

    const { status, errorMessage, data } =
      await postQueryRepository.foundCurrentBlogForPost(blogId);

    if (!data) {
      return res.status(status).send({
        errorsMessages: [
          {
            message: errorMessage,
            field: "blogId",
          },
        ],
      });
    }

    const {
      status: getPostStatus,
      data: getPostData,
      errorMessage: getPostErrorMessage,
    } = await postQueryRepository.getPostById(currentPostId);

    if (!getPostData) {
      return res.status(getPostStatus).send(getPostErrorMessage);
    }

    const { status: updatedPostStatus, errorMessage: updatedPostErrorMessage } =
      await postService.updatedPost({
        postId: getPostData.id,
        title,
        shortDescription,
        content,
      });

    if (updatedPostErrorMessage) {
      return res.status(updatedPostStatus).send(updatedPostErrorMessage);
    }

    res.sendStatus(updatedPostStatus);
  },
);

postRouter.delete(
  "/:postId",
  superAdminGuardMiddleware,
  async (req: RequestWithParams<GetCurrentPostId>, res: Response) => {
    const currentPostId = req.params.postId || "";

    const { status, errorMessage } =
      await postService.deletePost(currentPostId);

    if (errorMessage) {
      return res.status(status).send(errorMessage);
    }

    res.sendStatus(status);
  },
);

postRouter.post(
  "/:postId/comments",
  commentContentRequiredValidate,
  accessTokenMiddlewareGuard,
  getPostsValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<GetCurrentPostId, CreateCommentForPostProps>,
    res: Response,
  ) => {
    const currentPostId = req.params.postId || "";
    const currentUserId = req.user.userId;

    const { content } = req.body;

    const {
      status: userStatus,
      data: userData,
      errorMessage: userErrorMessage,
    } = await usersQueryRepositories.getCurrentUserByObjectId({
      _id: new ObjectId(currentUserId),
    });

    if (!userData) {
      return res.status(userStatus).send(userErrorMessage);
    }

    const {
      status: postStatus,
      errorMessage: postErrorMessage,
      data: postData,
    } = await postQueryRepository.getPostById(currentPostId);

    if (!postData) {
      return res.status(postStatus).send(postErrorMessage);
    }

    const { status, errorMessage, data } =
      await commentsService.createCommentForPost({
        content,
        userId: userData.id,
        userLogin: userData.login,
        postId: currentPostId,
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    const {
      status: currentCommentStatus,
      errorMessage: currentCommentErrorMessage,
      data: currentCommentData,
    } = await commentsQueryRepositories.getCurrentCommentById(data._id);

    if (!currentCommentData) {
      return res.status(currentCommentStatus).send(currentCommentErrorMessage);
    }

    res.status(status).send(currentCommentData);
  },
);

postRouter.get(
  "/:postId/comments",
  paginationAndSortingValidation(SortFields),
  async (
    req: RequestWithParamsAndQuery<
      GetCurrentPostId,
      Partial<GetPaginationAndSortForPostsAndComments>
    >,
    res: Response,
  ) => {
    const currentPostId = req.params.postId || "";

    const {
      status: postStatus,
      errorMessage: postErrorMessage,
      data: postData,
    } = await postQueryRepository.getPostById(currentPostId);

    if (!postData) {
      return res.status(postStatus).send(postErrorMessage);
    }

    const queryParamsForGetBlogs = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as PaginationAndSorting<SortFieldsForComments>;

    const allCommentsFromCurrentPost =
      await commentsQueryRepositories.getAllCommentsForCurrentPost({
        postId: postData.id,
        ...queryParamsForGetBlogs,
      });

    res.status(STATUSES_CODE.Success).send(allCommentsFromCurrentPost);
  },
);
