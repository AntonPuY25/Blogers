import { NextFunction, Response } from "express";
import { RequestWithParams } from "../types/basic-url-types";
import { GetCurrentCommentParams } from "../../comments/commentsRouters/interface";
import { ObjectId } from "mongodb";

export const objectIdValidateMiddleware = (
  req: RequestWithParams<GetCurrentCommentParams>,
  res: Response,
  next: NextFunction,
) => {
  const currentCommentId = req.params.commentId;

  if (!ObjectId.isValid(currentCommentId)) {
    return res.sendStatus(404);
  }

  next();
};
