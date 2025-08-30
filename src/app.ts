import express, {Express} from "express";
import {blogsRouter} from "./routers/blogs-router";
import {testRouter} from "./routers/test-router";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.use('/blogs', blogsRouter);
    app.use('/testing/all-data', testRouter);

    app.get("/", (req, res) => {
        res.status(200).send("Hello world!");
    });
    return app;
};
