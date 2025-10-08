import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const getPostsValidationErrorsMiddieWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();

    return;
  }

  const result = errors.array().map(({ msg }) => {
    return msg;
  });

  res.status(400).send({ errorsMessages: result });
};

export const titlePostMaxLengthValidate = body("title")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage({
    message: "Title field is Required and  must be maximum 30 symbols",
    field: "title",
  });

export const shortDescriptionPostMaxLengthValidate = body("shortDescription")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage({
    message:
      "ShortDescription field is Required and  must be maximum 100 symbols",
    field: "shortDescription",
  });

export const contentPostMaxLengthValidate = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage({
    message: "Content field is Required and  must be maximum 1000 symbols",
    field: "content",
  });

export const blogIdPostRequiredValidate = body("blogId")
  .notEmpty()
  .withMessage({
    message: "BlogId field is Required",
    field: "blogId",
  });

export const commentPostRequiredValidate = body("content")
  .isLength({ min: 20, max: 300 })
  .withMessage({
    message: "Content for comment field is Required",
    field: "content",
  });
