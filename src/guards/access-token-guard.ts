import { NextFunction, Request, Response } from "express";
import { jwtService } from "../jwtService/jwt-service";
import { RequestParamsForDeleteUserProps } from "../users/routers/types";

export const accessTokenMiddlewareGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //Проверяем есть ли вообще данный заголовок где хранится наш токен
  if (!req.headers.authorization) return res.sendStatus(401);

  //Разделяем наш заголовок на тип - и сам token
  const [authType, token] = req.headers.authorization.split(" ");

  //Тип для jwt токена должен быть Bearer
  if (authType !== "Bearer") return res.sendStatus(401);

  //Расшифровываем наш токен и получает из него наш paylod который мы вложили при его создании.
  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId } = payload;

    //Далее добавляем его в request , эта основная суть нашего middleware что бы
    // потом дальше в обработке роута мы могли достать данные и сравнить или т.д.
    req.user = { userId } as RequestParamsForDeleteUserProps; //Что бы можно было вложить свои кастомные данные, нужно задекларировать данный тип.
    next();

    return;
  }
  res.sendStatus(401);

  return;
};
