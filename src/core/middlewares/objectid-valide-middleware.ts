import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";

export const objectIdValidateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentCommentId = req.params.commentId;

  if (!ObjectId.isValid(currentCommentId)) {
    return res.sendStatus(404);
  }

  next();
};
