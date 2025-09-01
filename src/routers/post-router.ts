import {Request, Response, Router} from "express";
import {postRepository} from "../repositories/post-repository";
import {RequestWithBody, RequestWithBodyAndParams} from "../types";
import {CreatePostRequest} from "./types";
import {superAdminGuardMiddleware} from "../middlewares/auth-middleware";

export const postRouter = Router();

postRouter.get("/", (req:Request, res:Response) => {
    res.status(200).send(postRepository.getAllPosts());
});

postRouter.post("/",
    superAdminGuardMiddleware,
    (req:RequestWithBody<CreatePostRequest>, res:Response) => {
    const newPost = postRepository.createNewPost({...req.body});

    if(!newPost){
        return res.sendStatus(400)
    }


    res.status(201).send(newPost);
});

