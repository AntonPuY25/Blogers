import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
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
  contentPostMaxLengthValidate,
  getPostsValidationErrorsMiddieWare,
  shortDescriptionPostMaxLengthValidate,
  titlePostMaxLengthValidate,
} from "../../core/middlewares/validate-posts-middleware";
import { postService } from "../application/post-service";
import { paginationAndSortingValidation } from "../../core/middlewares/sort-and-pagination-middleware";
import { SortFields } from "../../blogs/routers/sort-fields";
import {
  GetAppBlogsPaginationWithSortWithSearchQuery,
  GetAppPostsPaginationWithSortWithSearchQuery,
} from "../../core/types/pagintaion-types";
import { setDefaultSortAndPaginationIfNotExist } from "../../blogs/repositories/helpers";

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

    const allPosts = await postService.getAllPosts(queryParamsForGetBlogs);

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

    const currentPost = await postService.getPostById(currentPostId);

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

    const currentBlog = await postService.foundCurrentBlogForPost(blogId);

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

    const currentPost = await postService.getPostById(currentPostId);

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
