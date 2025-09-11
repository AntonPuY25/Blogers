import { Request, Response, Router } from "express";

import { blogsRepository } from "../repositories/blogs-repository";
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
import { blogsBdRepository } from "../repositories/blogs-bd-repository";

export const blogsRouter = Router();

blogsRouter.get("/", async (req: Request, res: Response) => {
  const allBlogs = await blogsBdRepository.getAllBlogs();

  console.log(allBlogs, "allBlogs");

  res.status(200).send(allBlogs);
});

blogsRouter.post(
  "/",
  superAdminGuardMiddleware,
  descriptionBlogMaxLengthValidate,
  nameBlogMaxLengthValidate,
  websiteUrlBlogMaxLengthValidate,
  getBlogValidationErrorsMiddieWare,
  (req: RequestWithBody<CreateBlogType>, res: Response) => {
    const createBlog = blogsRepository.createBlog(req.body);

    res.status(201).send(createBlog);
  },
);

blogsRouter.get(
  "/:blogId",
  (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId;

    const currentBlog = blogsRepository.getCurrentBlog({
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
  (
    req: RequestWithBodyAndParams<GetCurrentBlogType, UpdatedBlogDataType>,
    res: Response,
  ) => {
    const currentBlogId = req.params.blogId || "";

    const currentBlog = blogsRepository.updateBlog({
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
  (req: RequestWithParams<GetCurrentBlogType>, res: Response) => {
    const currentBlogId = req.params.blogId || "";

    const currentBlog = blogsRepository.deleteBlog({ blogId: currentBlogId });

    if (!currentBlog) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  },
);
