import request from "supertest";
import express from "express";
import {setupApp} from "../src/app";
import { BlogType, CreateBlogType } from "../src/core/types/db-types";
import {ADMIN_USERNAME, ADMIN_PASSWORD} from "../src/core/middlewares/auth-middleware";
import {UpdateBlogType, UpdatedBlogDataType} from "../src/core/types/repositories-types";

describe("Blogs tests", () => {
    const app = express();

    setupApp(app);

    // Создаем Basic auth токен
    const basicAuthToken = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(204);
    });

    it(`should create new blog and get it'`, async () => {
      const testNewBlogData: CreateBlogType = {
        name: "Blog test",
        description: "Description test",
        websiteUrl: "https://samurai.it-test-incubator.io",
        isMembership: false,
        createdAt: new Date().toISOString(),
      };

      const createdBlog = await request(app)
        .post("/blogs")
        .set("Authorization", `Basic ${basicAuthToken}`)
        .send(testNewBlogData)
        .expect(201);

      const getBlogs = await request(app).get("/blogs").expect(200);

      expect(Array.isArray(getBlogs.body)).toBeTruthy();
      expect(getBlogs.body[0]?.name).toBe(testNewBlogData.name);
      expect(getBlogs.body[0]?.description).toBe(testNewBlogData.description);
      expect(getBlogs.body[0]?.websiteUrl).toBe(testNewBlogData.websiteUrl);

      const getCurrentBlog = await request(app)
        .get(`/blogs/${createdBlog.body.id}`)
        .expect(200);

      expect(getCurrentBlog.body?.name).toBe(testNewBlogData.name);
      expect(getCurrentBlog.body?.description).toBe(
        testNewBlogData.description,
      );
      expect(getCurrentBlog.body?.websiteUrl).toBe(testNewBlogData.websiteUrl);
    });

    it(`should update new blog and get it'`, async () => {

        const testNewBlogData:CreateBlogType = {
            name: "Blog test",
            description: 'Description test',
            websiteUrl: "https://samurai.it-test-incubator.io",
            isMembership: false,
          createdAt: new Date().toISOString(),
        };

        const testNewBlogDataForUpdate:UpdatedBlogDataType = {
            name: 'Updated name',
            description: 'Updated description',
            websiteUrl: "https://samurai.it-test-incubator.io"
        };


       const createdBlog = await request(app)
            .post("/blogs")
            .set('Authorization', `Basic ${basicAuthToken}`)
            .send(testNewBlogData)
            .expect(201)

        const getCurrentBlog = await request(app)
            .get(`/blogs/${createdBlog.body.id}`)
            .expect(200);

        expect(getCurrentBlog.body?.name).toBe(testNewBlogData.name);
        expect(getCurrentBlog.body?.description).toBe(testNewBlogData.description);
        expect(getCurrentBlog.body?.websiteUrl).toBe(testNewBlogData.websiteUrl);


       await request(app)
            .put(`/blogs/${createdBlog.body.id}`)
            .set('Authorization', `Basic ${basicAuthToken}`)
            .send(testNewBlogDataForUpdate)
            .expect(204);

        const getCurrentAfterUpdateBlog = await request(app)
            .get(`/blogs/${createdBlog.body.id}`)
            .expect(200);

        expect(getCurrentAfterUpdateBlog.body?.name).toBe(testNewBlogDataForUpdate.name);
        expect(getCurrentAfterUpdateBlog.body?.description).toBe(testNewBlogDataForUpdate.description);
        expect(getCurrentAfterUpdateBlog.body?.websiteUrl).toBe(testNewBlogDataForUpdate.websiteUrl);

            await request(app)
            .delete(`/blogs/${createdBlog.body.id}`)
            .set('Authorization', `Basic ${basicAuthToken}`)
            .expect(204);

        const getBlogs = await request(app)
            .get("/blogs")
            .expect(200);


        expect(getBlogs.body.length === 0).toBeFalsy();

    })

});