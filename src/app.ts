import express, { Express } from "express";
import { blogsRouter } from "./routers/blogs-router";
import { testRouter } from "./routers/test-router";
import { postRouter } from "./routers/post-router";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(TESTING_PATH, testRouter);

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });
  return app;
};
