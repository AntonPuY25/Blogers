import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
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
    const createBlog = await blogsService.createBlog(req.body);

    res.status(201).send(createBlog);
  },
);

blogsRouter.get(
  "/:blogId",
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId;

    const currentBlog = await blogsQueryRepository.getCurrentBlog({
      blogId: currentBlogId,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    res.status(200).send(currentBlog);
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
    req: RequestWithBodyAndParams<GetCurrentBlogType, UpdatedBlogDataType>,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId || "";

    const currentBlog = await blogsService.updateBlog({
      blogId: currentBlogId,
      ...req.body,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);

blogsRouter.delete(
  "/:blogId",
  superAdminGuardMiddleware,
  getBlogValidationErrorsMiddieWare,
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId || "";

    const currentBlog = await blogsService.deleteBlog({
      blogId: currentBlogId,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
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

    const currentBlog = await blogsQueryRepository.getCurrentBlog({
      blogId: currentBlogId,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    const allPostForCurrentBlog =
      await postQueryRepository.getAllPostsForCurrentBlog({
        blogId: currentBlog.id,
        ...queryParamsForGetPosts,
      });

    if (!allPostForCurrentBlog) {
      return res.sendStatus(404);
    }

    res.status(200).send(allPostForCurrentBlog);
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
    req: RequestWithBodyAndParams<
      GetCurrentBlogType,
      CreatePostForCurrentBlogProps
    >,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId as string;

    const currentBlog = await blogsQueryRepository.getCurrentBlog({
      blogId: currentBlogId,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    const createdPostForCurrentBlog = await postService.createNewPost({
      blogId: currentBlogId,
      ...req.body,
    });

    if (!createdPostForCurrentBlog) {
      return res.sendStatus(404);
    }

    res.status(201).send(createdPostForCurrentBlog);
  },
);
