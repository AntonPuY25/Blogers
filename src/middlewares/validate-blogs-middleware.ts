import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const getBlogValidationErrorsMiddieWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  }

  const result = errors.array().map(({ msg }) => {
    return msg;
  });

  res.status(400).send({ errorsMessages: result });
};

export const nameBlogMaxLengthValidate = body("name")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage({
    message: "Name field is Required and  must be maximum 15 symbols",
    field: "name",
  });

export const descriptionBlogMaxLengthValidate = body("description")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage({
    message: "Description field is required and  must be maximum 500 symbols",
    field: "description",
  });

export const websiteUrlBlogMaxLengthValidate = body("websiteUrl")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage({
    message: "WebsiteUrl field is required and  must be maximum 100 symbols",
    field: "websiteUrl",
  });

export const websiteUrlBlogUrlValidate = body("websiteUrl")
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage({
    message: "WebsiteUrl must be valid URL",
    field: "websiteUrl",
  });
