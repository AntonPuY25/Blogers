import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../../core/types/basic-url-types";
import {
  CreateBlogTypeForRepositories,
  GetCurrentBlogType,
  UpdatedBlogDataType,
} from "../../core/types/repositories-types";
import { superAdminGuardMiddleware } from "../../core/middlewares/auth-middleware";
import {
  descriptionBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  nameBlogMaxLengthValidate,
  querySearchNameTermValidate,
  websiteUrlBlogMaxLengthValidate,
} from "../../core/middlewares/validate-blogs-middleware";
import { blogsService } from "../service/blogs-service";
import { paginationAndSortingValidation } from "../../core/middlewares/sort-and-pagination-middleware";
import { SortFields } from "./sort-fields";
import {
  GetAppBlogsPaginationWithSortWithSearchQuery,
  GetAppPostsPaginationWithSortWithSearchQuery,
} from "../../core/types/pagintaion-types";
import { postService } from "../../posts/service/post-service";
import {
  contentPostMaxLengthValidate,
  shortDescriptionPostMaxLengthValidate,
  titlePostMaxLengthValidate,
} from "../../core/middlewares/validate-posts-middleware";
import { CreatePostForCurrentBlogProps } from "../../posts/service/interfaces";
import { setDefaultSortAndPaginationIfNotExist } from "../repositories/helpers";
import { blogsQueryRepository } from "../repositories/blog-query-repository";
import { postQueryRepository } from "../../posts/repositories/post-query-repository";
import { STATUSES_CODE } from "../../core/types/constants";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  paginationAndSortingValidation(SortFields),
  querySearchNameTermValidate,
  getBlogValidationErrorsMiddieWare,
  async (
    req: RequestWithQuery<
      Partial<GetAppBlogsPaginationWithSortWithSearchQuery>
    >,
    res: Response,
  ) => {
    const queryParamsForGetBlogs = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as GetAppBlogsPaginationWithSortWithSearchQuery;

    const allBlogs = await blogsQueryRepository.getAllBlogs(
      queryParamsForGetBlogs,
    );

    res.status(200).send(allBlogs);
  },
);

blogsRouter.post(
  "/",
  superAdminGuardMiddleware,
  descriptionBlogMaxLengthValidate,
  nameBlogMaxLengthValidate,
  websiteUrlBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  async (
    req: RequestWithBody<CreateBlogTypeForRepositories>,
    res: Response,
  ) => {
    const { status, errorMessage, data } = await blogsService.createBlog(
      req.body,
    );

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.status(status).send(data);
  },
);

blogsRouter.get(
  "/:blogId",
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId;

    const { status, errorMessage, data } =
      await blogsQueryRepository.getCurrentBlog({
        blogId: currentBlogId,
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    res.status(status).send(data);
  },
);

blogsRouter.put(
  "/:blogId",
  superAdminGuardMiddleware,
  descriptionBlogMaxLengthValidate,
  nameBlogMaxLengthValidate,
  websiteUrlBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<GetCurrentBlogType, UpdatedBlogDataType>,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId || "";

    const { status, errorMessage } = await blogsService.updateBlog({
      blogId: currentBlogId,
      ...req.body,
    });

    if (errorMessage) {
      return res.status(status).send(errorMessage);
    }

    res.sendStatus(status);
  },
);

blogsRouter.delete(
  "/:blogId",
  superAdminGuardMiddleware,
  getBlogValidationErrorsMiddieWare,
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId || "";

    const { status, errorMessage } = await blogsService.deleteBlog({
      blogId: currentBlogId,
    });

    if (errorMessage) {
      return res.status(status).send(errorMessage);
    }

    res.sendStatus(status);
  },
);

blogsRouter.get(
  "/:blogId/posts",
  paginationAndSortingValidation(SortFields),
  getBlogValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndQuery<
      GetCurrentBlogType,
      Partial<GetAppPostsPaginationWithSortWithSearchQuery>
    >,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId || "";

    const queryParamsForGetPosts = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as GetAppPostsPaginationWithSortWithSearchQuery;

    const { status, errorMessage, data } =
      await blogsQueryRepository.getCurrentBlog({
        blogId: currentBlogId,
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    const allPostForCurrentBlog =
      await postQueryRepository.getAllPostsForCurrentBlog({
        blogId: data.id,
        ...queryParamsForGetPosts,
      });

    res.status(STATUSES_CODE.Success).send(allPostForCurrentBlog);
  },
);

blogsRouter.post(
  "/:blogId/posts",
  titlePostMaxLengthValidate,
  shortDescriptionPostMaxLengthValidate,
  contentPostMaxLengthValidate,
  superAdminGuardMiddleware,
  getBlogValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<
      GetCurrentBlogType,
      CreatePostForCurrentBlogProps
    >,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId as string;

    const { status, errorMessage, data } =
      await blogsQueryRepository.getCurrentBlog({
        blogId: currentBlogId,
      });

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    const {
      status: getPostStatus,
      errorMessage: getPostErrorMessage,
      data: getPostData,
    } = await postQueryRepository.foundCurrentBlogForPost(currentBlogId);

    if (!getPostData) {
      return res.status(getPostStatus).send(getPostErrorMessage);
    }

    const {
      status: postStatus,
      data: postData,
      errorMessage: postErrorMessage,
    } = await postService.createNewPost({
      blogId: data.id,
      ...req.body,
    });

    if (!postData) {
      return res.status(postStatus).send(postErrorMessage);
    }

    res.status(postStatus).send(postData);
  },
);
