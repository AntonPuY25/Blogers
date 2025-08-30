import {Request, Response, Router} from "express";

import {blogsRepository} from "../repositories/blogs-repository";
import {RequestWithBody} from "../types";
import {CreateBlogType} from "../repositories/types";
import {superAdminGuardMiddleware} from "../middlewares/auth-middleware";
import {
    descriptionBlogMaxLengthValidate,
    getBlogValidationErrorsMiddieWare,
    nameBlogMaxLengthValidate,
    websiteUrlBlogMaxLengthValidate, websiteUrlBlogUrlValidate,
} from "../middlewares/validate-blogs-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", (req:Request, res:Response) => {
    res.status(200).send(blogsRepository.getAllBlogs());
});

blogsRouter.post("/",
    superAdminGuardMiddleware,
    descriptionBlogMaxLengthValidate,
    nameBlogMaxLengthValidate,
    websiteUrlBlogMaxLengthValidate,
    websiteUrlBlogUrlValidate,
    getBlogValidationErrorsMiddieWare,
    (req:RequestWithBody<CreateBlogType>, res: Response) => {
    const createBlog = blogsRepository.createBlog(req.body);

    res.status(201).send(createBlog);
});

