import { Response, Router } from "express";
import { commentsQueryRepositories } from "../commentsRepository/comments-query-repository";
import { ObjectId } from "mongodb";
import {
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../core/types/basic-url-types";
import { GetCurrentCommentParams, UpdateCurrentComment } from "./interface";
import { objectIdValidateMiddleware } from "../../core/middlewares/objectid-valide-middleware";
import {
  commentContentRequiredValidate,
  getPostsValidationErrorsMiddieWare,
} from "../../core/middlewares/validate-posts-middleware";
import { accessTokenMiddlewareGuard } from "../../guards/access-token-guard";

export const commentsRouters = Router();

commentsRouters.get(
  "/:commentId",
  objectIdValidateMiddleware,
  async (req: RequestWithParams<GetCurrentCommentParams>, res: Response) => {
    const commentId = req.params.commentId;

    const currentComment =
      await commentsQueryRepositories.getCurrentCommentById(
        new ObjectId(commentId),
      );

    if (!currentComment) {
      res.sendStatus(404);
    }

    res.status(200).send(currentComment);
  },
);

commentsRouters.put(
  "/:commentId",
  accessTokenMiddlewareGuard,
  objectIdValidateMiddleware,
  commentContentRequiredValidate,
  getPostsValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<
      GetCurrentCommentParams,
      UpdateCurrentComment
    >,
    res: Response,
  ) => {
    const commentId = req.params.commentId;

    const currentComment =
      await commentsQueryRepositories.getCurrentCommentById(
        new ObjectId(commentId),
      );

    if (!currentComment) {
      res.sendStatus(404);
    }


  },
);
