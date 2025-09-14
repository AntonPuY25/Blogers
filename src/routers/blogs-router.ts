import { Request, Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../types";
import {
  CreateBlogType,
  GetCurrentBlogType,
  UpdatedBlogDataType,
} from "../repositories/types";
import { superAdminGuardMiddleware } from "../middlewares/auth-middleware";
import {
  descriptionBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  nameBlogMaxLengthValidate,
  websiteUrlBlogMaxLengthValidate,
} from "../middlewares/validate-blogs-middleware";
import { blogsRepository } from "../repositories/blogs-repository";

export const blogsRouter = Router();

blogsRouter.get("/", async (req: Request, res: Response) => {
  const allBlogs = await blogsRepository.getAllBlogs();

  res.status(200).send(allBlogs);
});

blogsRouter.post(
  "/",
  superAdminGuardMiddleware,
  descriptionBlogMaxLengthValidate,
  nameBlogMaxLengthValidate,
  websiteUrlBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  async (req: RequestWithBody<CreateBlogType>, res: Response) => {
    const createBlog = await blogsRepository.createBlog(req.body);

    console.log(createBlog,'createBlog');

    res.status(201).send(createBlog);
  },
);

blogsRouter.get(
  "/:blogId",
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId;

    const currentBlog = await blogsRepository.getCurrentBlog({
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

    const currentBlog = await blogsRepository.updateBlog({
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
  async (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId || "";

    const currentBlog = await blogsRepository.deleteBlog({
      blogId: currentBlogId,
    });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);
