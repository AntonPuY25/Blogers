import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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

  res.status(400).send({ errorsMessages: result });
};

export const loginUserMaxAndMinLengthValidate = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
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

export const emailUserMaxAndMinLengthValidate = body("email")
  .trim()
  .isEmail()
  .withMessage({
    message: "Email field is Required and  must be maximum 15 symbols",
    field: "email",
  });
