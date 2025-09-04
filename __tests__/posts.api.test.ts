import request from "supertest";
import express from "express";
import {setupApp} from "../src/app";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../src/middlewares/auth-middleware";
import {BlogType, PostType} from "../src/db/types";

describe("Posts tests", () => {
    const app = express();

    setupApp(app);

    // Создаем Basic auth токен
    const basicAuthToken = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(204);
    });

    it(`should create new blog and post for it and get post by id'`, async () => {
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

        const getCurrentBlog = await request(app)
            .get(`/blogs/${testNewBlogData.id}`)
            .expect(200);



        expect(getCurrentBlog.body?.name).toBe(testNewBlogData.name);
        expect(getCurrentBlog.body?.description).toBe(testNewBlogData.description);
        expect(getCurrentBlog.body?.websiteUrl).toBe(testNewBlogData.websiteUrl);

        const testNewPostData:PostType = {
            id: new Date().getMilliseconds().toString(),
            title: "Post test",
            shortDescription: 'Description for test post',
            content: 'content for test post',
            blogName: getCurrentBlog.body?.name,
            blogId: getCurrentBlog.body?.id,
        };


        const createdPost = await request(app)
            .post("/posts")
            .set('Authorization', `Basic ${basicAuthToken}`)
            .send(testNewPostData)
            .expect(201)

        expect(createdPost.body?.title).toBe(testNewPostData.title);
        expect(createdPost.body?.shortDescription).toBe(testNewPostData.shortDescription);
        expect(createdPost.body?.content).toBe(testNewPostData.content);
        expect(testNewBlogData.name).toBe(testNewPostData.blogName);
        expect(testNewBlogData.id).toBe(testNewPostData.blogId);

    })

});