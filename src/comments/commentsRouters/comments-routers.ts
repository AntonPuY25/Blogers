import { Response, Router } from "express";
import { commentsQueryRepositories } from "../commentsRepository/comments-query-repository";
import { ObjectId } from "mongodb";
import { RequestWithParams } from "../../core/types/basic-url-types";
import { GetCurrentCommentParams } from "./interface";
import { objectIdValidateMiddleware } from "../../core/middlewares/objectid-valide-middleware";

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
