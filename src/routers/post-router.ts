import {Request, Response, Router} from "express";
import {postRepository} from "../repositories/post-repository";
import {RequestWithBody, RequestWithParams} from "../types";
import {CreatePostRequest, GetCurrentPostId} from "./types";
import {superAdminGuardMiddleware} from "../middlewares/auth-middleware";
import {
    blogIdPostRequiredValidate,
    contentPostMaxLengthValidate,
    getPostsValidationErrorsMiddieWare,
    shortDescriptionPostMaxLengthValidate,
    titlePostMaxLengthValidate
} from "../middlewares/validate-posts-middleware";

export const postRouter = Router();

postRouter.get("/", (req:Request, res:Response) => {
    res.status(200).send(postRepository.getAllPosts());
});

postRouter.post("/",
    superAdminGuardMiddleware,
    titlePostMaxLengthValidate,
    shortDescriptionPostMaxLengthValidate,
    contentPostMaxLengthValidate,
    blogIdPostRequiredValidate,
    getPostsValidationErrorsMiddieWare,
    (req:RequestWithBody<CreatePostRequest>, res:Response) => {
    const newPost = postRepository.createNewPost({...req.body});

    if(!newPost){
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "Current blog is not found",
                    "field": "blogId"
                }
            ]
        })
    }


    res.status(201).send(newPost);
});

postRouter.get("/:postId", (req:RequestWithParams<GetCurrentPostId>, res:Response) => {
    const currentPostId = req.params.postId;

    const currentPost = postRepository.getPostById(currentPostId);

    if(!currentPost) {
        return res.sendStatus(404)
    }

    res.status(200).send(currentPost)
});