import express, { Express } from "express";
import { blogsRouter } from "./blogs/routers/blogs-router";
import { testRouter } from "./tests/routers/test-router";
import { postRouter } from "./posts/routers/post-router";
import {
  AUTH_PATH,
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH
} from "./core/paths/paths";
import { usersRouter } from "./users/routers/user-routers";
import { authRouter } from "./auth/routers/routers";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(TESTING_PATH, testRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });
  return app;
};
