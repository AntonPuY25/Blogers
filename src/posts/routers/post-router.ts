import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
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
  commentPostRequiredValidate,
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

    res.status(200).send(allPosts);
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
    const newPost = await postService.createNewPost({ ...req.body });

    if (!newPost) {
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Current blog is not found",
            field: "blogId",
          },
        ],
      });
    }

    res.status(201).send(newPost);
  },
);

postRouter.get(
  "/:postId",
  async (req: RequestWithParams<GetCurrentPostId>, res: Response) => {
    const currentPostId = req.params.postId || "";

    const currentPost = await postQueryRepository.getPostById(currentPostId);

    if (!currentPost) {
      return res.sendStatus(404);
    }

    res.status(200).send(currentPost);
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
    req: RequestWithBodyAndParams<GetCurrentPostId, UpdatePostData>,
    res: Response,
  ) => {
    const currentPostId = req.params.postId || "";
    const { content, shortDescription, title, blogId } = req.body;

    const currentBlog =
      await postQueryRepository.foundCurrentBlogForPost(blogId);

    if (!currentBlog) {
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Current blog is not found",
            field: "blogId",
          },
        ],
      });
    }

    const currentPost = await postQueryRepository.getPostById(currentPostId);

    if (!currentPost) {
      return res.sendStatus(404);
    }

    const updatedPost = await postService.updatedPost({
      postId: currentPost.id,
      title,
      shortDescription,
      content,
    });

    if (!updatedPost) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);

postRouter.delete(
  "/:postId",
  superAdminGuardMiddleware,
  async (req: RequestWithParams<GetCurrentPostId>, res: Response) => {
    const currentPostId = req.params.postId || "";

    const isDeletedPost = await postService.deletePost(currentPostId);

    if (!isDeletedPost) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);

postRouter.post(
  "/:postId/comments",
  commentPostRequiredValidate,
  accessTokenMiddlewareGuard,
  getPostsValidationErrorsMiddieWare,
  async (
    req: RequestWithBodyAndParams<GetCurrentPostId, CreateCommentForPostProps>,
    res: Response,
  ) => {
    const currentPostId = req.params.postId || "";
    const currentUserId = req.user.userId;

    const currentUser = await usersQueryRepositories.getCurrentUserByObjectId({
      _id: new ObjectId(currentUserId),
    });

    const currentPost = await postQueryRepository.getPostById(currentPostId);

    const { content } = req.body;

    if (!currentPost || !currentUser) {
      return res.sendStatus(404);
    }

    const createdCommentId = await commentsService.createCommentForPost({
      content,
      userId: currentUser.id.toString(),
      userLogin: currentUser.login,
      postId: currentPostId,
    });

    const currentComment =
     await commentsQueryRepositories.getCurrentCommentById(createdCommentId);

    if (!currentComment) {
      return res.sendStatus(404);
    }

    res.status(201).send(currentComment);
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

    const queryParamsForGetBlogs = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as PaginationAndSorting<SortFieldsForComments>;

    const allCommentsFromCurrentPost =
      postQueryRepository.getAllCommentsForCurrentPost({
        postId: currentPostId,
        ...queryParamsForGetBlogs,
      });

    if (!allCommentsFromCurrentPost) {
      return res.sendStatus(404);
    }

    res.status(201);
  },
);
