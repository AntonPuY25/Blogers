import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const getUserValidationErrorsMiddieWare = (
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

  const firstError = errors.array()[0];
  const statusCode = (firstError.msg as any)?.code || 400;

  res.status(statusCode || 400).send({ errorsMessages: result });
};

export const loginUserMaxAndMinLengthValidate = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
  .custom((value) => {
    const patternLoginData = /^[a-zA-Z0-9_-]*$/;
    if (!patternLoginData.test(value)) {
      throw new Error("Login should be valid");
    }

    return true;
  })
  .withMessage({
    message: "Login field is Required and  must be maximum 15 symbols",
    field: "login",
  });

export const passwordUserMaxAndMinLengthValidate = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage({
    message: "Password field is Required and  must be maximum 15 symbols",
    field: "password",
  });

export const loginOrEmailUserMaxAndMinLengthValidate = body("loginOrEmail")
  .trim()
  .isLength({ min: 3, max: 15 })
  .withMessage({
    message: "Login Or Email field is Required and  must be maximum 15 symbols",
    field: "loginOrEmail",
  });

export const emailUserMaxAndMinLengthValidate = body("email")
  .trim()
  .isEmail()
  .withMessage({
    message: "Email field is Required and  must be maximum 15 symbols",
    field: "email",
  });

export const userIdLengthValidate = param("userId")
  .trim()
  .isLength({ min: 24, max: 24 })
  .withMessage({
    message: "User ID must be exactly 24 characters",
    field: "id",
    code: 404,
  });

