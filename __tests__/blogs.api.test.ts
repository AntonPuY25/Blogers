import request from "supertest";
import express from "express";
import {setupApp} from "../src/app";
import {BlogType} from "../src/db/types";
import {ADMIN_USERNAME, ADMIN_PASSWORD} from "../src/middlewares/auth-middleware";

describe("Blogs tests", () => {
    const app = express();

    setupApp(app);

    // Создаем Basic auth токен
    const basicAuthToken = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');


    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(204);
    });


    it(`should create new blog and get it'`, async () => {

        const testNewBlogData:BlogType = {
            id: new Date().getMilliseconds().toString(),
            name: "Blog test",
            description: 'Description test',
            websiteUrl: "https://samurai.it-test-incubator.io"
        };

        await request(app)
            .post("/blogs")
            .set('Authorization', `Basic ${basicAuthToken}`)
            .send(testNewBlogData)
            .expect(201)

        const getBlogs = await request(app)
            .get("/blogs")
            .expect(200);

        expect(Array.isArray(getBlogs.body)).toBeTruthy();
        expect(getBlogs.body[0]?.name).toBe(testNewBlogData.name);
        expect(getBlogs.body[0]?.description).toBe(testNewBlogData.description);
        expect(getBlogs.body[0]?.websiteUrl).toBe(testNewBlogData.websiteUrl);

    });

});