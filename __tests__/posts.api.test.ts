import request from "supertest";
import express from "express";
import {setupApp} from "../src/app";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../src/middlewares/auth-middleware";

describe("Posts tests", () => {
    const app = express();

    setupApp(app);

    // Создаем Basic auth токен
    const basicAuthToken = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(204);
    });

    it(`should create new post and get it by id'`, async () => {

    })




});