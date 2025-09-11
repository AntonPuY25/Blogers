import { Request, Response, Router } from "express";
import { postRepository } from "../repositories/post-repository";
import {
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../types";
import { CreatePostRequest, GetCurrentPostId, UpdatePostData } from "./types";
import { superAdminGuardMiddleware } from "../middlewares/auth-middleware";
import {
  blogIdPostRequiredValidate,
  contentPostMaxLengthValidate,
  getPostsValidationErrorsMiddieWare,
  shortDescriptionPostMaxLengthValidate,
  titlePostMaxLengthValidate,
} from "../middlewares/validate-posts-middleware";

export const postRouter = Router();

postRouter.get("/", async (req: Request, res: Response) => {
  const allPosts = await postRepository.getAllPosts();
  res.status(200).send(allPosts);
});

postRouter.post(
  "/",
  superAdminGuardMiddleware,
  titlePostMaxLengthValidate,
  shortDescriptionPostMaxLengthValidate,
  contentPostMaxLengthValidate,
  blogIdPostRequiredValidate,
   getPostsValidationErrorsMiddieWare,
  async (req: RequestWithBody<CreatePostRequest>, res: Response) => {
    const newPost =await postRepository.createNewPost({ ...req.body });

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

    const currentPost =await postRepository.getPostById(currentPostId);

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

    const currentBlog = await postRepository.foundCurrentBlogForPost(blogId);

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

    const currentPost =await postRepository.getPostById(currentPostId);

    if (!currentPost) {
      return res.sendStatus(404);
    }

    const updatedPost =await postRepository.updatedPost({
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

    const isDeletedPost = await postRepository.deletePost(currentPostId);

    if (!isDeletedPost) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);
