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
  getCommentsValidationErrorsMiddieWare,
} from "../../core/middlewares/validate-posts-middleware";
import { accessTokenMiddlewareGuard } from "../../guards/access-token-guard";
import { commentsService } from "../commentsService/comments-service";

export const commentsRouters = Router();

commentsRouters.get(
  "/:commentId",
  objectIdValidateMiddleware,
  async (req: RequestWithParams<GetCurrentCommentParams>, res: Response) => {
    const commentId = req.params.commentId;

    const { status, data, errorMessage } =
      await commentsQueryRepositories.getCurrentCommentById(
        new ObjectId(commentId),
      );

    if (!data) {
      return res.status(status).send(errorMessage);
    }

    return res.status(status).send(data);
  },
);

commentsRouters.put(
  "/:commentId",
  accessTokenMiddlewareGuard,
  objectIdValidateMiddleware,
  commentContentRequiredValidate,
  getCommentsValidationErrorsMiddieWare,
  async (
    req: RequestWithParamsAndBody<
      GetCurrentCommentParams,
      UpdateCurrentComment
    >,
    res: Response,
  ) => {
    const commentId = req.params.commentId;
    const commentContent = req.body.content;
    const currentUserId = req.user.userId;

    const { status, errorMessage } = await commentsService.updateCommentForPost(
      {
        commentId,
        content: commentContent,
        userId: currentUserId || "",
      },
    );

    if (errorMessage) {
      return res.status(status).send(errorMessage);
    }

    return res.sendStatus(status);
  },
);

commentsRouters.delete(
  "/:commentId",
  accessTokenMiddlewareGuard,
  objectIdValidateMiddleware,
  getCommentsValidationErrorsMiddieWare,
  async (req: RequestWithParams<GetCurrentCommentParams>, res: Response) => {
    const commentId = req.params.commentId;
    const currentUserId = req.user.userId;

      const { status, errorMessage } = await commentsService.deleteCommentById(
          {
              commentId,
              userId: currentUserId || "",
          },
      );

      if (errorMessage) {
          return res.status(status).send(errorMessage);
      }

      return res.sendStatus(status);
  },
);
