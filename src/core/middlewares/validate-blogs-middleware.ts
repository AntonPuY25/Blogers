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

    return
  }

  const result = errors.array().map(({ msg }) => {
    return msg;
  });

  res.status(401).send({ errorsMessages: result });
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
  .custom((value) => {
    // Проверяем длину
    if (!value || value.length < 1 || value.length > 100) {
      throw new Error("WebsiteUrl field is required and must be maximum 100 symbols");
    }

    // Проверяем формат URL
    const urlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    if (!urlRegex.test(value)) {
      throw new Error("WebsiteUrl should be valid URL");
    }

    return true;
  })
  .withMessage({
    message: "WebsiteUrl field is required and must be maximum 100 symbols",
    field: "websiteUrl",
  });

export const querySearchNameTermValidate = body("searchNameTerm")
  .optional()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage({
    message: "SearchNameTerm field is  must be maximum 500 symbols",
    field: "SearchNameTerm",
  });